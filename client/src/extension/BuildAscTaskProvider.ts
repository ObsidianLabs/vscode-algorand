import * as path from 'path'
import * as vscode from 'vscode'

import ChildProcess from './ChildProcess'
import algorandImageChannel from './ipc/algorandImageChannel'

interface BuildAscTaskDefinition extends vscode.TaskDefinition {
	type: string
	version?: string
}

export class BuildAscTaskProvider implements vscode.TaskProvider {
	static type = 'Algorand Compiler'
	private tasks: vscode.Task[] | undefined

	constructor(private workspaceRoot: string) { }

	public async provideTasks(): Promise<vscode.Task[]> {
		if (!await this.checkDocker()) {
			return []
		}
		return this.getTasks()
	}

	public async resolveTask(_task: vscode.Task): Promise<vscode.Task | undefined> {
		const definition: BuildAscTaskDefinition = <any>_task.definition
		if (!await this.checkDocker()) {
			return undefined
		}
		return this.getTask(definition.version || 'latest', definition)
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
		if (!this.tasks) {
			const versions = await algorandImageChannel.versions()
			if (!versions.length) {
				vscode.window.showWarningMessage('Docker image algorand/stable not installed.')
			}
			this.tasks = versions.map(v => this.getTask(v.Tag))
		}
		return this.tasks
	}

	private getTask(version: string, definition?: BuildAscTaskDefinition): vscode.Task | undefined {
		const activeEditor = vscode.window.activeTextEditor
		if (!activeEditor) {
			return undefined
		}

		const file = path.relative(this.workspaceRoot, activeEditor.document.fileName)
		
		if (definition === undefined) {
			definition = {
				type: BuildAscTaskProvider.type,
				version
			}
		}

		const extname = path.extname(file)
		let execution
		if (extname === '.py') {
			execution = new vscode.ShellExecution(`docker run -t --rm --name build-pyteal -v "${this.workspaceRoot}:/project" -w /project obsidians/pyteal:0.6.0 /bin/bash -c "python ${file} > ${file.replace('.py', '.teal')}"`)
		} else if (extname === '.teal') {
			execution = new vscode.ShellExecution(`docker run -t --rm --name build-teal -v "${this.workspaceRoot}:/project" -w /project algorand/stable:${version} /bin/bash -c "/root/node/goal clerk compile ${file}"`)
		}

		const name = `TEAL or PyTeal`
		return new vscode.Task(definition, vscode.TaskScope.Workspace, name, BuildAscTaskProvider.type, execution)
	}
}
