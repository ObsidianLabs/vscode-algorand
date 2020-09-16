import * as cp from 'child_process';

export default class ChildProcess {
  static exec (cmd, config = {}, opt?) : Promise<{ code: number, logs: string }> {
		if (opt && opt.writeEmitter) {
			opt.writeEmitter.fire(`> ${cmd}\r\n`)
		}

    let proc
    return new Promise(resolve => {
      proc = cp.spawn(cmd, [], {
        shell: process.platform === 'win32' ? 'powershell.exe' : true,
        ...config
      })

      let logs = ''
      proc.stdout.on('data', data => {
				if (opt && opt.onData) {
					opt.onData(data.toString())
				}
				if (opt && opt.writeEmitter) {
					opt.writeEmitter.fire(data.toString().replace(/\n/g, '\r\n'))
				}
        logs += data.toString()
      })

      proc.stderr.on('data', data => {
				if (opt && opt.onData) {
					opt.onData(data.toString())
				}
				if (opt && opt.writeEmitter) {
					opt.writeEmitter.fire(data.toString().replace(/\n/g, '\r\n'))
				}
				logs += data.toString()
      });

      proc.on('close', code => {
				if (opt && opt.writeEmitter) {
					opt.writeEmitter.fire('\r\n')
				}
        resolve({ code, logs })
      })
    })
  }
}