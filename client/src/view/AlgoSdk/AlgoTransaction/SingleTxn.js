export default class SingleTxn {
  constructor (txn, signer) {
    this.txn = txn
    this.signer = signer
    this.signed = null
  }

  setDefaultParams (params) {
    this.txn = {
      ...this.txn,
      ...params,
      gh: params.genesisHash
    }
  }

  async sign (gid) {
    this.signed = await this.signer(this.txn, gid)
  }
}