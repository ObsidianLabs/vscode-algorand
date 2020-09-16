export default class IpcChannel {
  constructor(channel = 'default', uid = '') {
    this.channel = channel
    this.uid = uid

		this.onDataReceived = this.onDataReceived.bind(this)

		if (typeof window !== 'undefined') {
			window.addEventListener('message', this.onDataReceived)
			this._vscode = window.vscodeApi
		}
		this._counter = 0
		this._requests = {}
  }

  get channelName() {
    return `obsidians-ipc-${this.channel}-${this.uid}`
  }

  get channelResponse() {
    return `obsidians-ipc-response-${this.channel}-${this.uid}`
	}
	
  dispose () {
		if (typeof window !== 'undefined') {
			window.removeEventListener('message', this.onDataReceived)
		}
  }

  onDataReceived (event) {
		const message = event.data
		if (message.channel !== this.channelResponse) {
			return
		}

		const req = this._requests[message.counter]
		if (!req) {
			return
		}
		if (req.callback) {
			req.callback(message)
			if (message.done) {
				this._requests[message.counter] = null
			}
			return
		}
		const { counter, err, data } = message
		if (err) {
			console.warn(new Error(`[${req.method}] ${err}`))
			req.reject(err)
		} else {
			req.resolve(data)
		}
		this._requests[counter] = null
  }

  invoke (method, ...args) {
		this._counter++
		const promise = new Promise((resolve, reject) => {
      this._requests[this._counter] = { resolve, reject, method, args }
		})
		this._vscode?.postMessage({
			channel: this.channelName,
			method,
			args,
			counter: this._counter,
		})
		return promise
	}
	
	invokeWithCallback (method, callback, ...args) {
		this._counter++
		this._requests[this._counter] = { method, args, callback }
		this._vscode?.postMessage({
			channel: this.channelName,
			method,
			args,
			counter: this._counter,
		})
	}
}