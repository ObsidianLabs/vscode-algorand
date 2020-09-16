import IpcChannel from '../ipc/IpcChannel'
import DockerImageChannel from '../ipc/DockerImageChannel'

const channel = new IpcChannel('algorand-node')

channel.node = new DockerImageChannel('algorand/stable')

export default channel