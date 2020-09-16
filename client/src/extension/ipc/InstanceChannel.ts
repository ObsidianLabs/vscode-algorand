import * as vscode from 'vscode'
import * as fs from 'fs'

import IpcChannel from './IpcChannel'
import algorandImageChannel from './algorandImageChannel'

import { AlgorandNodeTaskProvider } from '../AlgorandNodeTaskProvider'
import AlgorandVolumeTerminal from './AlgorandVolumeTerminal'

export default class InstanceChannel extends IpcChannel {
	
	private nodeExecution: vscode.TaskExecution
	private createInstanceExecution: vscode.TaskExecution

	static txns: string = '{}'

	constructor (panel: vscode.WebviewPanel) {
		super('algorand-node', '', panel)
		algorandImageChannel.setPanel(panel)
	}

	async list () {
		const { logs: containers } = await this.exec(`docker ps --format "{{json . }}"`)
		const algoNodes = containers.split('\n').filter(Boolean).map(t => JSON.parse(t)).filter(x => x.Names.startsWith('algorand-')).map(x => x.Names)

		const { logs: volumes } = await this.exec(`docker volume ls --format "{{json . }}"`)
		const instances = volumes.split('\n').filter(Boolean).map(t => JSON.parse(t)).filter(x => x.Name.startsWith('algorand-'))
    const instancesWithLabels = instances.map(i => {
      const labels = {} as any
      i.Labels.split(',').forEach(x => {
        const [name, value] = x.split('=')
        labels[name] = value
      })
			i.Labels = labels
			if (algoNodes.indexOf(`${i.Name}-${labels.version}`) > -1) {
				i.running = true
			}
      return i
		})
		return instancesWithLabels.filter(x => x.Labels.chain === 'testnet')
	}

	async create ({ name, version, chain = 'testnet' }) {
		const execution = new vscode.CustomExecution(async (): Promise<vscode.Pseudoterminal> => {
			return new AlgorandVolumeTerminal(name, version, chain)
		})
		
		const task = new vscode.Task({
			type: AlgorandNodeTaskProvider.type
		}, vscode.TaskScope.Workspace, `Create new instance`, AlgorandNodeTaskProvider.type, execution)

		this.createInstanceExecution = await vscode.tasks.executeTask(task)

		return new Promise(resolve => {
			const disposable = vscode.tasks.onDidEndTask(e => {
				if (e.execution.task.name === 'Create new instance') {
					disposable.dispose()
					resolve()
				}
			})
		})
	}

	async cancelCreate () {
		this.createInstanceExecution.terminate()
	}

	async delete (name) {
    await this.exec(`docker volume rm algorand-${name}`)
	}

	async startNode ({ name, version }, counter) {
		const existingVersions = await algorandImageChannel.versions()
		if (!existingVersions.find(v => v.Tag === version)) {
			this.sendResponse({ counter, stop: true })
			vscode.window.showWarningMessage(`Docker image algorand/stable:${version} not installed.`)
			return
		}

		if (!this.nodeExecution) {
			const task = AlgorandNodeTaskProvider.getTask(`algorand-${name}`, version)
			this.nodeExecution = await vscode.tasks.executeTask(task)
		}

		const disposable = vscode.tasks.onDidEndTask(e => {
			const definition = e.execution.task.definition
			if (definition.type === AlgorandNodeTaskProvider.type && definition.volume === `algorand-${name}` && definition.version === version) {
				disposable.dispose()
				this.nodeExecution = null
				vscode.window.showInformationMessage(`Algorand node stopped.`)
				this.sendResponse({ counter, stop: true })
			}
		})

		await new Promise(resolve => setTimeout(resolve, 2000))
		const getAlgodToken = await this.exec(`docker exec algorand-${name}-${version} cat /data/algod.token`)
		if (!getAlgodToken.code) {
			vscode.window.showInformationMessage(`Algorand node started.`)
			this.sendResponse({ counter, token: getAlgodToken.logs })
		}
	}

	async stopNode ({ name, version }) {
		await this.exec(`docker stop algorand-${name}-${version}`)
	}

	async saveTxns (txns) {
		InstanceChannel.txns = txns
	}

	async loadTxns () {
		return InstanceChannel.txns
	}

	async readFile (filePath, encoding = 'utf8') {
		const content = fs.readFileSync(filePath, encoding)
		return content
	}

	async txPushed(result) {
		const openExplorer = 'Open in Explorer';
		const action = await vscode.window.showInformationMessage(`Transaction pushed with txId ${result.txId}.`, openExplorer)
		if (action === openExplorer) {
			vscode.env.openExternal(vscode.Uri.parse(`https://testnet.algoexplorer.io/tx/${result.txId}`))
		}
	}
}