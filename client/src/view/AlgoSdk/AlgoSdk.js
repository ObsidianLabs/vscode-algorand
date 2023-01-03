import parseUrl from 'url-parse'
import algosdk from 'algosdk'

import AlgoClient from './AlgoClient'
import AlgoTransaction from './AlgoTransaction'

export default class AlgoSdk {
  constructor ({ url, token }) {
    const { protocol, hostname, port } = parseUrl(url)
    this.client = new AlgoClient({
      server: `${protocol}//${hostname}`,
      port,
      token,
    })
    this.assets = {}
  }

  isValidAddress (addr) {
    return algosdk.isValidAddress(addr)
  }

  async accountFrom (addr) {
    const account = await this.client.algod.accountInformation(addr)
    if (account.thisassettotal) {

    }
    return account
  }

  async getAssetInfo (assetId) {
    if (!this.assets[assetId]) {
      this.assets[assetId] = await this.client.assetInformation(assetId)
    }
    return this.assets[assetId]
  }

  async getTransactions (addr, cursor) {
    if (!cursor) {
      const result = await fetch(`https://testnet-algorand.api.purestake.io/ps2/account/${addr}/transactions/latest/20`)
      const json = await result.json()
      return {
        cursor: json.length ? json[0].index - 1 : '',
        data: json.reverse(),
      }
    }
    const from = cursor < 20 ? 0 : cursor - 19
    const result = await fetch(`https://testnet-algorand.api.purestake.io/ps2/account/${addr}/transactions/from/${from}/to/${cursor}`)
    const json = await result.json()
    return {
      cursor: json.length ? json[0].index - 1 : '',
      data: json.reverse(),
    }
  }

  newTransaction (tx, signatureProvider) {
    return new AlgoTransaction(tx, signatureProvider, this.client)
  }

  async transfer ({ from, to, amount, note = '' }, signatureProvider) {
    const algoTxn = this.newTransaction({
      name: 'transfer',
      accounts: [],
      txns: [{
        type: 'pay',
        params: { from, to, amount },
        signers: [from]
      }]
    }, signatureProvider)
    await algoTxn.sign()
    return await algoTxn.push()
  }

  async transferAsset ({ assetId, from, to, amount, note = '' }, signatureProvider) {
    const algoTxn = this.newTransaction({
      name: 'transfer asset',
      accounts: [],
      txns: [{
        type: 'asset-transfer',
        params: { assetId, from, to, amount },
        signers: [from]
      }]
    }, signatureProvider)
    await algoTxn.sign()
    return await algoTxn.push()
  }
}
