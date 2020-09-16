import algosdk from 'algosdk'

export default {
  newKeypair () {
    const key = algosdk.generateAccount()
    return {
      address: key.addr,
			sk: key.sk,
			secret: algosdk.secretKeyToMnemonic(key.sk),
    }
  },
  importKeypair (secret) {
    const key = algosdk.mnemonicToSecretKey(secret)
    return {
      address: key.addr,
			sk: key.sk,
      secret,
    }
  },
}