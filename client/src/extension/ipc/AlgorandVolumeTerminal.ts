import * as vscode from 'vscode'
import * as os from 'os'
import * as path from 'path'

import ChildProcess from '../ChildProcess'

export default class AlgorandVolumeTerminal implements vscode.Pseudoterminal {
	private writeEmitter = new vscode.EventEmitter<string>()
	onDidWrite: vscode.Event<string> = this.writeEmitter.event
	private closeEmitter = new vscode.EventEmitter<void>()
	onDidClose?: vscode.Event<void> = this.closeEmitter.event

	constructor(private name: string, private version: string, private chain: string) {
	}

	open(initialDimensions: vscode.TerminalDimensions | undefined): void {
		this.createVolumeWithSnapshot()
	}

	close(): void {}

	private async createVolumeWithSnapshot(): Promise<void> {
		this.writeEmitter.fire(`Clean up\r\n\r\n`)

		const tmpdir = os.tmpdir()
		const subFolder = `${this.chain}-v1.0`
		await ChildProcess.exec(`rm -rf algorand-snapshot`, { cwd: tmpdir }, { writeEmitter: this.writeEmitter })
		await ChildProcess.exec(`mkdir -p algorand-snapshot/data/${subFolder}`, { cwd: tmpdir }, { writeEmitter: this.writeEmitter })

		const snapshotDir = path.join(tmpdir, 'algorand-snapshot')
		this.writeEmitter.fire(`\r\nDownloading Algorand snapshot to ${snapshotDir}\r\n\r\n`)
		const snapshot = `https://algorand-snapshots.s3.us-east-1.amazonaws.com/network/${subFolder}/latest.tar.gz`
		// const snapshot = `https://obsidianreleasesintl.oss-accelerate.aliyuncs.com/Algorand/network/${subFolder}/latest.tar.gz`
		await ChildProcess.exec(`curl ${snapshot} -o latest.tar.gz`, { cwd: snapshotDir }, { writeEmitter: this.writeEmitter })
		await ChildProcess.exec(`tar xvf latest.tar.gz -C data/${subFolder}`, { cwd: snapshotDir }, { writeEmitter: this.writeEmitter })

		this.writeEmitter.fire(`\r\nCreating a new Algorand node instance...\r\n\r\n`)
		await ChildProcess.exec(`docker volume create --label version=${this.version},chain=${this.chain} algorand-${this.name}`, { cwd: snapshotDir }, { writeEmitter: this.writeEmitter })
    await ChildProcess.exec(`docker run --rm -v algorand-${this.name}:/data algorand/stable:${this.version} /bin/bash -c 'cp genesisfiles/${this.chain}/genesis.json /data/genesis.json'`, { cwd: snapshotDir }, { writeEmitter: this.writeEmitter })
    await ChildProcess.exec(`docker run -d --rm -it --name algorand-config-${this.name} -v algorand-${this.name}:/data algorand/stable:${this.version} /bin/bash`, { cwd: snapshotDir }, { writeEmitter: this.writeEmitter })
    await ChildProcess.exec(`docker cp data/${subFolder} algorand-config-${this.name}:/data/${subFolder}`, { cwd: snapshotDir }, { writeEmitter: this.writeEmitter })
    await ChildProcess.exec(`docker stop algorand-config-${this.name}`, { cwd: snapshotDir }, { writeEmitter: this.writeEmitter })

		this.closeEmitter.fire()
	}

	private async createVolumeWithCatchpoint(): Promise<void> {
		this.writeEmitter.fire(`Clean up\r\n\r\n`)

		this.writeEmitter.fire(`\r\nFetch Algorand catchpoint\r\n`)
		const catchpointUrl = `https://algorand-catchpoints.s3.us-east-2.amazonaws.com/channel/testnet/latest.catchpoint`
		const { logs: catchpoint } = await ChildProcess.exec(`curl -s ${catchpointUrl}`, null, { writeEmitter: this.writeEmitter })
		console.log(catchpoint)

		this.writeEmitter.fire(`\r\nCreating a new Algorand node instance...\r\n\r\n`)
		await ChildProcess.exec(`docker volume create --label version=${this.version},chain=${this.chain} algorand-${this.name}`, null, { writeEmitter: this.writeEmitter })
    await ChildProcess.exec(`docker run --rm -v algorand-${this.name}:/data algorand/stable:${this.version} /bin/bash -c 'cp genesisfiles/${this.chain}/genesis.json /data/genesis.json'`, null, { writeEmitter: this.writeEmitter })
    await ChildProcess.exec(`docker run -d --rm -it --name algorand-config-${this.name} -v algorand-${this.name}:/data algorand/stable:${this.version} /bin/bash`, null, { writeEmitter: this.writeEmitter })
		
		await ChildProcess.exec(`docker exec algorand-config-${this.name} ./goal node start -d /data -l 0.0.0.0:8080`, null, { writeEmitter: this.writeEmitter })
		await ChildProcess.exec(`docker exec algorand-config-${this.name} ./goal node status -d /data`, null, { writeEmitter: this.writeEmitter })
		await ChildProcess.exec(`docker exec algorand-config-${this.name} ./goal node catchup ${catchpoint.trim()} -d /data`, null, { writeEmitter: this.writeEmitter })
		await ChildProcess.exec(`docker exec algorand-config-${this.name} ./goal node status -d /data`, null, { writeEmitter: this.writeEmitter })
		
		await ChildProcess.exec(`docker stop algorand-config-${this.name}`, null, { writeEmitter: this.writeEmitter })

		this.closeEmitter.fire()
	}
}