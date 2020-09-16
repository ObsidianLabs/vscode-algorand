import algosdk from 'algosdk'

export default class AlgoClient {
  constructor({ server, port, token }) {
    this.algod = new algosdk.Algod(token, server, port)
  }
  
  async getDefaultParams () {
    const params = await this.algod.getTransactionParams()
    return {
      genesisHash: params.genesishashb64,
      genesisID: params.genesisID,
      firstRound: params.lastRound,
      lastRound: params.lastRound + 1000,
      fee: params.minFee
    }
  }

  async getTransactions (addr, cursor) {
    return await this.algod.transactionByAddress(addr, cursor)
  }

  async assetInformation (assetId) {
    return await this.algod.assetInformation(assetId)
  }

  async pushTransaction (signedTxn) {
    let result
    try {
			result = await this.algod.sendRawTransactions(signedTxn)
    } catch (e) {
      throw new Error(e.text)
    }
    await this.waitForConfirmation(result.txId)
    return result
  }

  async waitForConfirmation (txId) {
    while (true) {
      let lastround = (await this.algod.status()).lastRound;
      let pendingInfo = await this.algod.pendingTransactionInformation(txId);
      if (pendingInfo.round && pendingInfo.round > 0) {
        console.log("Transaction " + pendingInfo.tx + " confirmed in round " + pendingInfo.round)
        break;
      }
      await this.algod.statusAfterBlock(lastround + 1);
    }
  }
}