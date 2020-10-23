import algosdk from 'algosdk'

import SingleTxn from './SingleTxn'
import { regularSigner, msigSigner, lsigSigner } from './signers'

export default class AlgoTransaction {
  constructor (tx, signatureProvider, algoClient) {
    if (typeof tx !== 'object') {
      throw new Error('AlgoTransaction needs to be initialized with an object.')
    }
    // if (!tx.name || typeof tx.name !== 'string') {
    //   throw new Error()
    // }
    this.signatureProvider = signatureProvider
    this.algoClient = algoClient
    this.parse(tx)
  }

  parse (tx) {
    this.name = tx.name
    this.parseAccountList(tx.accounts || [])
    this.txns = tx.txns.map(txn => this.parseSingleTxn(txn))
  }

  parseAccountList (accountList) {
    this.accounts = {}

    const msigAccountList = []

    accountList.forEach(account => {
      const { name, addr, msig } = account
      if (!name) {
        throw new Error(`The address ${addr} does not has a name.`)
      }
      if (!msig) {
        if (!addr) {
          throw new Error('Non-msig account must have an address.')
        }
        this.accounts[name] = { addr }
      } else {
        msigAccountList.push({ name, msig })
      }
    })

    msigAccountList.forEach(account => {
      const msig = {
        ...account.msig,
        addrs: account.msig.addrs.map(n => this.getAddress(n)),
      }
      this.accounts[account.name] = {
        addr: algosdk.multisigAddress(msig),
        msig,
      }
    })
  }

  getAddress(n) {
    return this.accounts[n] ? this.accounts[n].addr : n
  }

  getLease(lease) {
    if (lease) {
      return Uint8Array.from(window.atob(lease), c => c.charCodeAt(0))
    }
    return undefined
  }

  parseSingleTxn (txn) {
    const { type, params, ...rest } = txn
    let algoTxn
    switch (type) {
      case 'pay':
        const amount = Number(params.amount) * 1000000
        if (params.to && !amount) {
          throw new Error(`Invalid amount value: ${params.amount}`)
        }
        if (amount !== Math.floor(amount)) {
          throw new Error(`Invalid amount value: ${params.amount}`)
        }
        algoTxn = {
          type: 'pay',
          from: this.getAddress(params.from),
          to: this.getAddress(params.to),
          amount,
          closeRemainderTo: this.getAddress(params.closeRemainderTo),
          note: params.note || undefined,
          lease: this.getLease(params.lease),
          ...rest,
        }
        break;
      case 'asset-create':
        algoTxn = {
          type: 'acfg',
          from: this.getAddress(params.from || params.manager),
          note: params.note || undefined,
          assetTotal: params.total,
          assetDecimals: params.decimals,
          assetName: params.name,
          assetUnitName: params.unit,
          assetURL: params.url,
          assetMetadataHash: params.meta,
          assetManager: this.getAddress(params.manager),
          assetReserve: this.getAddress(params.reserve || params.manager),
          assetFreeze: this.getAddress(params.freeze || params.manager),
          assetClawback: this.getAddress(params.clawback || params.manager),
          assetDefaultFrozen: params.defaultFrozen,
          lease: this.getLease(params.lease),
          ...rest,
        }
        break;
      case 'asset-modify':
        algoTxn = {
          type: 'acfg',
          assetIndex: params.assetId,
          from: this.getAddress(params.from),
          note: params.note || undefined,
          assetManager: this.getAddress(params.manager),
          assetReserve: this.getAddress(params.reserve),
          assetFreeze: this.getAddress(params.freeze),
          assetClawback: this.getAddress(params.clawback),
          lease: this.getLease(params.lease),
          ...rest,
        }
        break
      case 'asset-freeze':
        algoTxn = {
          type: 'afrz',
          assetIndex: params.assetId,
          from: this.getAddress(params.from),
          note: params.note || undefined,
          freezeAccount: this.getAddress(params.target),
          freezeState: params.state,
          lease: this.getLease(params.lease),
          ...rest,
        }
        break
      case 'asset-destroy':
        algoTxn = {
          type: 'acfg',
          assetIndex: params.assetId,
          from: this.getAddress(params.from),
          note: params.note || undefined,
          lease: this.getLease(params.lease),
          ...rest,
        }
        break
      case 'asset-opt-in':
        algoTxn = {
          type: 'axfer',
          from: this.getAddress(params.from),
          to: this.getAddress(params.from),
          assetIndex: params.assetId,
          note: params.note || undefined,
          lease: this.getLease(params.lease),
          ...rest,
        }
        break
      case 'asset-transfer':
        algoTxn = {
          type: 'axfer',
          from: this.getAddress(params.from),
          to: this.getAddress(params.to),
          amount: params.amount,
          assetIndex: params.assetId,
          closeRemainderTo: this.getAddress(params.closeRemainderTo),
          assetRevocationTarget: this.getAddress(params.assetRevocationTarget),
          note: params.note || undefined,
          lease: this.getLease(params.lease),
          ...rest,
        }
        break
      case 'keyreg':
        algoTxn = {
          type: 'keyreg',
          from: this.getAddress(params.from),
          note: params.note || undefined,
          voteKey: this.getAddress(params.vote),
          selectionKey: this.getAddress(params.selection),
          voteFirst: params.first,
          voteLast: params.last,
          voteKeyDilution: params.dilution,
          lease: this.getLease(params.lease),
          ...rest,
        }
        break
      default:
        throw new Error(`Unknown transaction type: ${txn.type}`)
    }
    if (txn.lsig) {
      let sp
      if (txn.lsig.signer) {
        txn.lsig.signer = this.getAddress(txn.lsig.signer)
        sp = this.signatureProvider(txn.lsig.signer)
      }
      return new SingleTxn(algoTxn, lsigSigner(sp, txn.lsig))
    }

    if (txn.signers) {
      txn.signers.forEach(n => {
        if (this.accounts[n] && this.accounts[n].msig) {
          throw new Error('Do not use a multisig account in signers. Please provide individual signers.')
        }
      })

      if (txn.signers.length === 1) {
        const addr = this.getAddress(txn.signers[0])
        const sp = this.signatureProvider(addr)
        return new SingleTxn(algoTxn, regularSigner(sp))
      }

      const msig = this.accounts[params.from].msig
      if (!msig) {
        throw new Error('The from is not a multi-sig address.')
      }

      const signers = txn.signers.map(n => this.getAddress(n))
      const getSigs = async algoTxn => {
        const sigs = {}
        for (const signer of signers) {
          const sp = this.signatureProvider(signer)
          const rawSig = await sp({ algoTxn, raw: true })
          sigs[signer] = rawSig
        }
        return sigs
      }
      return new SingleTxn(algoTxn, msigSigner(getSigs, msig))
    }

    throw new Error(`Transaction does not have signers or LogicSignature.`)
  }

  async sign () {
    const defaultParams = await this.algoClient.getDefaultParams()
    this.txns.forEach(t => t.setDefaultParams(defaultParams))
    let gid
    if (this.txns.length > 1) {
      gid = algosdk.computeGroupID(this.txns.map(t => t.txn))
    }
    return Promise.all(this.txns.map(t => t.sign(gid)))
  }

  get grouped () {
    return this.txns.map(t => t.signed.blob)
  }

  async push () {
    return await this.algoClient.pushTransaction(this.grouped)
  }
}
