import * as vscode from 'vscode'
import ChildProcess from './ChildProcess'

interface AlgorandNodeDefinition extends vscode.TaskDefinition {
	type: string
	volume: string
	version?: string
}

export class AlgorandNodeTaskProvider implements vscode.TaskProvider {
	static type = 'Algorand Node'
	private tasks: vscode.Task[] | undefined

	constructor(private workspaceRoot: string) {}

	public async provideTasks(): Promise<vscode.Task[]> {
		if (!await this.checkDocker()) {
			return []
		}
		return this.getTasks()
	}

	public async resolveTask(_task: vscode.Task): Promise<vscode.Task | undefined> {
		const volume: string[] = _task.definition.volume
		if (volume) {
			const definition: AlgorandNodeDefinition = <any>_task.definition
			if (!await this.checkDocker()) {
				return undefined
			}
			return AlgorandNodeTaskProvider.getTask(definition.volume, definition.version || 'latest', definition)
		}
		return undefined
	}

	private async checkDocker(): Promise<Boolean> {
		const result = await ChildProcess.exec('docker info')
		if (result.code) {
			vscode.window.showWarningMessage('Docker is required to compile TEAL scripts. Please make sure Docker is installed and started.')
			return false
		}
		return true
	}

	private async getTasks(): Promise<vscode.Task[]> {
		// const instances = await this.instanceChannel.list()

		this.tasks = []
		// instances.forEach(instance => this.tasks!.push(AlgorandNodeTaskProvider.getTask(instance.Name, instance.Labels.version)))
		return this.tasks
	}

	public static getTask(volume: string, version: string, definition?: AlgorandNodeDefinition): vscode.Task {
		if (definition === undefined) {
			definition = {
				type: AlgorandNodeTaskProvider.type,
				volume,
				version,
			}
		}

		const execution = new vscode.CustomExecution(async (): Promise<vscode.Pseudoterminal> => {
			return new AlgorandNodeTaskTerminal(volume, version)
		})
		
		const name = `Start v${version} for ${volume}`
		return new vscode.Task(definition, vscode.TaskScope.Workspace, name, AlgorandNodeTaskProvider.type, execution)
	}
}


class AlgorandNodeTaskTerminal implements vscode.Pseudoterminal {
	private writeEmitter = new vscode.EventEmitter<string>()
	onDidWrite: vscode.Event<string> = this.writeEmitter.event
	private closeEmitter = new vscode.EventEmitter<void>()
	onDidClose?: vscode.Event<void> = this.closeEmitter.event

	private fileWatcher: vscode.FileSystemWatcher | undefined

	constructor(private volume: string, private version: string) {
	}

	open(initialDimensions: vscode.TerminalDimensions | undefined): void {
		this.startAlgorandNode()
	}

	handleInput (data: string) {
		this.writeEmitter.fire(data)
		if (data.length === 1 && data.charCodeAt(0) === 3) {
			this.writeEmitter.fire(`> docker stop ${this.volume}-${this.version}\r\n`)
			ChildProcess.exec(`docker stop ${this.volume}-${this.version}`).then(result => {
				this.writeEmitter.fire(`${result.logs}\r\n`)
				this.closeEmitter.fire()
			})
		}
	}

	close(): void {
		ChildProcess.exec(`docker stop ${this.volume}-${this.version}`)
	}

	private async startAlgorandNode(): Promise<void> {
		this.writeEmitter.fire('Starting Algorand Node...\r\n')
		
		const startAlgoDocker = `docker run -dt --rm --name ${this.volume}-${this.version} -p 8080:8080 -v "${this.volume}:/data" algorand/stable:${this.version} /bin/bash`
		this.writeEmitter.fire(`> ${startAlgoDocker}\r\n`)
		const result = await ChildProcess.exec(startAlgoDocker)
		this.writeEmitter.fire(`${result.logs}\r\n`)
		if (result.code) {
			this.closeEmitter.fire()
			return
		}

		const startAlgoNode = `docker exec ${this.volume}-${this.version} ./goal node start -d /data -l 0.0.0.0:8080`
		this.writeEmitter.fire(`> ${startAlgoNode}\r\n`)
		const result2 = await ChildProcess.exec(startAlgoNode)
		this.writeEmitter.fire(`${result2.logs}\r\n`)
		if (result2.code) {
			this.closeEmitter.fire()
			return
		}

		const getAlgodToken = `docker exec ${this.volume}-${this.version} cat /data/algod.token`
		this.writeEmitter.fire(`> ${getAlgodToken}\r\n`)
		const result3 = await ChildProcess.exec(getAlgodToken)
		this.writeEmitter.fire(`${result3.logs}\r\n`)
		if (result3.code) {
			this.closeEmitter.fire()
			return
		}

		const streamLogs = `docker exec ${this.volume}-${this.version} ./carpenter -color -d /data`
		this.writeEmitter.fire(`> ${streamLogs}\r\n`)
		await ChildProcess.exec(streamLogs, {}, {
			onData: data => {
				this.writeEmitter.fire(data.split('\n').join('\r\n'))
			}
		})
		this.closeEmitter.fire()
	}
}