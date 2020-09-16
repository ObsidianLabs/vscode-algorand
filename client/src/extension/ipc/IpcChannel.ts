import * as vscode from 'vscode'
import fetch from 'node-fetch'

import ChildProcess from '../ChildProcess'

export default class IpcChannel {
  constructor(private channel: string = 'default', protected uid: string = '', protected panel?: vscode.WebviewPanel) {
		this.onReceiveMessage = this.onReceiveMessage.bind(this)
		if (panel) {
			this.start()
		}
  }

  private get channelName() {
    return `obsidians-ipc-${this.channel}-${this.uid}`
  }

  private get channelResponse() {
    return `obsidians-ipc-response-${this.channel}-${this.uid}`
  }

  start () {
    if (!this.channel) {
      throw new Error(`Not a valid IpcChannel (channel name: ${this.channel}`)
    }

		this.panel?.webview.onDidReceiveMessage(
			this.onReceiveMessage,
			null,
			// this._disposables
		)
  }

  dispose () {
    // ipcMain.removeHandler(this.channelName)
	}
	
	onReceiveMessage (msg) {
		if (msg.channel !== this.channelName) {
			return
		}
		this.onRequest(msg.method, msg.args, msg.counter)
			.then(data => { this.sendResponse({ counter: msg.counter, data }) })
			.catch(err => { this.sendResponse({ counter: msg.counter, err }) })
	}

  async onRequest (method, args, counter) {
    if (!this[method]) {
      throw new Error(`Method ${method} is not defined for channel ${this.channel}`)
		}
		const cloned = [...args]
		cloned.push(counter)
    return this[method](...cloned)
  }

  sendResponse (response) {
		this.panel?.webview.postMessage({
			channel: this.channelResponse,
			...response,
		})
  }

  async exec (command, config?) {
    return await ChildProcess.exec(command.trim(), config)
  }

  async fetch (url): Promise<string> {
		const res = await fetch(url)
		return res.text()
  }
}
