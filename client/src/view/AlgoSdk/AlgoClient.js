import algosdk from 'algosdk'

export default class AlgoClient {
  constructor({ server, port, token }) {
    this.algod = new algosdk.Algodv2(token, server, port)
  }

  async getDefaultParams() {
    const params = await this.algod.getTransactionParams().do()
    return {
      genesisHash: params.genesisHash,
      genesisID: params.genesisID,
      firstRound: params.firstRound,
      lastRound: params.firstRound + 1000,
      fee: algosdk.ALGORAND_MIN_TX_FEE
    }
  }

  async getTransactions(addr, cursor) {
    return await this.algod.transactionByAddress(addr, cursor)
  }

  async assetInformation(assetId) {
    return await this.algod.getAssetByID(assetId).do()
  }

  async pushTransaction(signedTxn) {
    let result
    try {
      result = await this.algod.sendRawTransaction(signedTxn).do()
      await algosdk.waitForConfirmation(this.algod, result.txId, 1000);
      return result
    } catch (e) {
      console.log(e)
      throw new Error(e.text)
    }
  }
}
