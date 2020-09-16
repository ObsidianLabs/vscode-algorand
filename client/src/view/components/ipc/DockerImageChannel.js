import IpcChannel from './IpcChannel'

export default class DockerImageChannel extends IpcChannel {
  constructor(imageName) {
    super('docker-image', imageName)
    this.eventTarget = new EventTarget()
  }

  get imageName () {
    return this.uid
  }

  async installed () {
    return await this.invoke('any')
  }

  async versions () {
		const versions = await this.invoke('versions')
    const event = new CustomEvent('versions', { detail: versions })
    this.eventTarget.dispatchEvent(event)
    return versions
  }

  onVersionsRefreshed (callback) {
    const eventHandler = event => callback(event.detail)
    this.eventTarget.addEventListener('versions', eventHandler)
  }

  async remoteVersions (size = 10) {
    return await this.invoke('remoteVersions', size)
	}
	
	async download (version) {
    return await this.invoke('downloadVersion', version)
  }

  async delete (version) {
    return await this.invoke('deleteVersion', version)
  }
}