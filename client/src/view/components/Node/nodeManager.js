import instanceChannel from '../Instance/instanceChannel'

class NodeManager {
  constructor () {
    this._algoSdk = null
    this._terminal = null
  }

  set status (v) {
    this._status = v
  }

  get algoSdk () {
    return this._algoSdk
  }

  set terminal (v) {
    this._terminal = v
  }

  set minerTerminal (v) {
    this._minerTerminal = v
  }

  set status (v) {
    this._status = v
  }

  async start ({ name, version, chain }, { onStart, onStop }) {
		const callback = msg => {
			if (msg.stop) {
				onStop()
				return
			} else if (msg.token) {
				onStart({
					url: 'http://localhost:8080',
					token: msg.token,
				})
			}
		}
		instanceChannel.invokeWithCallback('startNode', callback, { name, version, chain })
  }

  // updateLifecycle (lifecycle, params) {
  //   if (this._status) {
  //     this._status.setState({ lifecycle })
  //   }
  //   if (params) {
  //     // this._algoSdk = new AlgoSdk(params)
  //   } else {
  //     this._algoSdk = null
  //   }
  // }

  updateBlockNumber (blockNumber) {
    if (this._status) {
      this._status.setState({ blockNumber })
    }
  }

  async stop ({ name, version }) {
		await instanceChannel.invoke('stopNode', { name, version })
	}
}

export default new NodeManager()
