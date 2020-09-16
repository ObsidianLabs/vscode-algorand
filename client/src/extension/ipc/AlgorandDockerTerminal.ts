import * as vscode from 'vscode'

import ChildProcess from '../ChildProcess'

export default class AlgorandDockerTerminal implements vscode.Pseudoterminal {
	private writeEmitter = new vscode.EventEmitter<string>()
	onDidWrite: vscode.Event<string> = this.writeEmitter.event
	private closeEmitter = new vscode.EventEmitter<void>()
	onDidClose?: vscode.Event<void> = this.closeEmitter.event

	constructor(private version: string) {}

	open(initialDimensions: vscode.TerminalDimensions | undefined): void {
		this.pullImage()
	}

	close(): void {}

	private async pullImage(): Promise<void> {
		await ChildProcess.exec(`docker pull algorand/stable:${this.version}`, null, { writeEmitter: this.writeEmitter })
		this.closeEmitter.fire()
	}
}