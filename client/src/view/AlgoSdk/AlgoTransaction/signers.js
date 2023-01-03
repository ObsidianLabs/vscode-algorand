import algosdk, { decodeAddress, encodeObj, signMultisigTransaction } from 'algosdk'
import * as txnBuilder from 'algosdk/dist/esm/src/transaction'
import { MultisigTransaction } from 'algosdk/dist/esm/src/multisig'
export const regularSigner = sp => async (txn, gid) => {
  const algoTxn = new txnBuilder.Transaction(txn)
  if (gid) {
    algoTxn.group = gid
  }
  return {
    txID: algoTxn.txID().toString(),
    blob: await sp({ algoTxn })
  }
}

export const msigSigner = (getSigs, msig) => async (txn, gid) => {
  const algoTxn = new MultisigTransaction(txn)
  if (gid) {
    algoTxn.group = gid
  }

  const sigs = await getSigs(algoTxn)

  const subsig = msig.addrs.map(addr => {
    const pk = decodeAddress(addr).publicKey
    if (!sigs[addr]) {
      return { pk: Buffer.from(pk) }
    }
    return {
      pk: Buffer.from(pk),
      s: sigs[addr]
    }
  })

  const abbrMsig = {
    v: msig.version,
    thr: msig.threshold,
    subsig,
  }

  return {
    txID: algoTxn.txID().toString(),
    blob: new Uint8Array(encodeObj({
      msig: abbrMsig,
      txn: algoTxn.get_obj_for_encoding(),
    }))
  }
}

export const lsigSigner = (sp, lsig) => async (txn, gid) => {
  const byteCode = new Uint8Array(Buffer.from(lsig.program, 'base64'))
  let logicSig
  if (lsig.args) {
    logicSig = new algosdk.LogicSigAccount(byteCode, lsig.args)
  } else {
    logicSig = new algosdk.LogicSigAccount(byteCode)
  }
  if (sp) {
    await sp({ logicSig })
  }

  const algoTxn = new txnBuilder.Transaction(txn)
  if (gid) {
    algoTxn.group = gid
  }
  return algosdk.signLogicSigTransactionObject(algoTxn, logicSig)
}