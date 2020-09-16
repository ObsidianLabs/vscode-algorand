import * as vscode from 'vscode'
import * as semver from 'semver'

import IpcChannel from './IpcChannel'

import { AlgorandNodeTaskProvider } from '../AlgorandNodeTaskProvider'
import AlgorandDockerTerminal from './AlgorandDockerTerminal'

class DockerImageChannel extends IpcChannel {
	private filter: (x: any) => boolean
	private sort: (x: any, y: any) => number

  constructor (imageName: string, panel: vscode.WebviewPanel, opts: any = {}) {
    super('docker-image', imageName, panel)
    this.filter = opts.filter || (() => true)
    this.sort = opts.sort
	}
	
	setPanel (panel: vscode.WebviewPanel) {
		this.panel = panel
		this.start()
	}

  get imageName () {
    return this.uid
  }

  async versions () {
    const { logs } = await this.exec(`docker images ${this.imageName} --format "{{json . }}"`)
    let versions = logs.split('\n')
      .filter(Boolean)
      .map(x => JSON.parse(x))
			.filter(({ Tag }) => this.filter(Tag))
    if (this.sort) {
      versions = versions.sort((x, y) => this.sort(x.Tag, y.Tag))
    }
    return versions
	}
	
  async downloadVersion (version) {
		const execution = new vscode.CustomExecution(async (): Promise<vscode.Pseudoterminal> => {
			return new AlgorandDockerTerminal(version)
		})
		
		const task = new vscode.Task({
			type: AlgorandNodeTaskProvider.type
		}, vscode.TaskScope.Workspace, `Pull docker image`, AlgorandNodeTaskProvider.type, execution)

		await vscode.tasks.executeTask(task)

		return new Promise(resolve => {
			const disposable = vscode.tasks.onDidEndTask(e => {
				if (e.execution.task.name === 'Pull docker image') {
					disposable.dispose()
					resolve()
				}
			})
		})
  }

  async deleteVersion (version) {
    await this.exec(`docker rmi ${this.imageName}:${version}`)
  }

  async remoteVersions (size = 10) {
		const res = await this.fetch(`http://registry.hub.docker.com/v1/repositories/${this.imageName}/tags`)
    let versions = JSON.parse(res).filter(({ name }) => this.filter(name))
    if (this.sort) {
      versions = versions.sort((x, y) => this.sort(x.name, y.name))
    }
    return versions.slice(0, size)
  }

  async any () {
    const versions = await this.versions()
    return !!(versions && versions.length)
  }
}

export default new DockerImageChannel('algorand/stable', null, {
	filter: tag => semver.valid(tag),
	sort: (x, y) => semver.lt(x, y) ? 1 : -1,
})