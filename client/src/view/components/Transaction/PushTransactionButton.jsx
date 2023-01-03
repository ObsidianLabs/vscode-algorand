import React, { PureComponent } from 'react'
import classnames from 'classnames'

import {
  Button,
	Modal,
	UncontrolledTooltip,
} from '@obsidians/ui-components'

import path from 'path-browserify'

import instanceChannel from '../Instance/instanceChannel'
import { kp } from '../../AlgoSdk'

export default class PushTransactionButton extends PureComponent {
	constructor (props) {
		super(props)

		this.state = {
			pending: false,
			keys: [],
		}
		this.modal = React.createRef()
	}

	onClickButton = async () => {
		if (!this.props.running) {
			return
		}

		this.modal.current.openModal()
		this.modal.current.hideError()
		try {
			const content = await instanceChannel.invoke('readFile', this.props.keysFile, 'utf8')
			const mnemonics = JSON.parse(content).map(item => item.mnemonic).filter(Boolean)
			const keys = mnemonics.map(m => kp.importKeypair(m))
			this.setState({ keys })
		} catch (e) {
			this.setState({ keys: [] })
			this.modal.current.showError('Error in reading the keys file.')
		}
	}

	prepareTxns = async () => {
		let { txnsJson, workspaceRoot } = this.props

		const files = {}
    const regex = /\"(file|base64):([^"]+)\"/g

    let match = regex.exec(txnsJson)
    while (match) {
      const type = match[1]
      let filePath = match[2]
      if (!path.isAbsolute(filePath)) {
        filePath = path.join(workspaceRoot, filePath)
      }
      if (!files[filePath]) {
        files[filePath] = []
      }
      files[filePath].push([type, match[0]])

      match = regex.exec(txnsJson)
		}

    for (const filePath in files) {
      let base64 = ''

      for (const item of files[filePath]) {
				const [type, replacing] = item
				if (type === 'file') {
          const content = await instanceChannel.invoke('readFile', filePath, 'utf8')
          txnsJson = txnsJson.replace(replacing, `"${content}"`)
        } else if (type === 'base64') {
          if (!base64) {
            base64 = await instanceChannel.invoke('readFile', filePath, 'base64')
          }
          txnsJson = txnsJson.replace(replacing, `"${base64}"`)
        }
			}
		}

    return JSON.parse(txnsJson)
	}

	signatureProvider = addr => {
		return ({ algoTxn, logicSig, raw = false }) => {
			const key = this.state.keys.find(k => k.address === addr)

			if (!key) {
				throw new Error(`Mnemonics not found for address ${addr}`)
			}
	
			if (logicSig) {
				return logicSig.sign(key.sk)
			} else if (raw) {
				return algoTxn.rawSignTxn(key.sk)
			} else {
				return algoTxn.signTxn(key.sk)
			}
		}
	}

	pushTransaction = async () => {
		this.setState({ pending: true })
		this.modal.current.hideError()
		try {
			const txns = await this.prepareTxns()
			const algoTxn = this.props.algoSdk.newTransaction(txns, this.signatureProvider)
			await algoTxn.sign()
			const result = await algoTxn.push()
			instanceChannel.invoke('txPushed', result)
			this.modal.current.closeModal()
		} catch (e) {
			console.log(e)
			this.modal.current.showError(e.message)
		}
		
		this.setState({ pending: false })
	}
	
  render () {
    return (
      <React.Fragment>
        <Button
					id='push-transaction'
					key='push-transaction'
          color='success'
					className={classnames(this.props.className, !this.props.running && 'disabled')}
					onClick={this.onClickButton}
        >
          <i className='fas fa-upload mr-1' />
          Push Transaction
        </Button>
				<UncontrolledTooltip target='push-transaction'>
					{!this.props.running && 'No Algorand node is started'}
				</UncontrolledTooltip>
        <Modal
					ref={this.modal}
					overflow
          title={`Push Transaction`}
					textConfirm='Sign and Push'
					onConfirm={this.pushTransaction}
					onClosed={() => this.setState({ pending: false })}
					pending={this.state.pending && 'Pushing...'}
				>
					The transaction will be signed using the following keys
					<ul>
          	{this.state.keys.map(k => <li key={k.address}><code>{k.address}</code></li>)}
					</ul>
        </Modal>
      </React.Fragment>
    )
  }
}
