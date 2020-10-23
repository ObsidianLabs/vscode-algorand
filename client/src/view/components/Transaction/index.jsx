import React, { PureComponent } from 'react'

import {
	Card,
	MultiSelect,
	FormGroup,
	ButtonGroup,
	Button,
	Label,
	InputGroup,
	Input,
} from '@obsidians/ui-components'

import instanceChannel from '../Instance/instanceChannel'

import TransactionModal from './TransactionModal'
import PushTransactionButton from './PushTransactionButton'

let index = 0
const newIndex = () => {
	index++
	return `${Math.floor(Math.random()*1000)}-${index}`
}
const withLabel = data => {
	const value = data.value || newIndex()
  return {
		...data,
		value,
    label: <span key={value}>{data.type}</span>
  }
}

export default class Transaction extends PureComponent {
	constructor (props) {
		super(props)

    this.modal = React.createRef()

		this.options = [
			{
				label: 'Add',
				options: [
					{ label: 'Add New Item...', getValue: this.getTxn },
				]
			}
		]

		this.state = {
			txns: [],
			txnsJson: '{\n  "txns": []\n}',
			keysFile: `${window.workspaceRoot}/keys.json`
		}
	}

	componentDidMount () {
		instanceChannel.invoke('loadTxns').then(txns => {
			try {
				this.onChange(JSON.parse(txns).map(withLabel), true)
			} catch (e) {}
		})
	}
	
	onChange = (txns, skipSave) => {
		if (!skipSave) {
			instanceChannel.invoke('saveTxns', JSON.stringify(txns))
		}

		const txnsJson = JSON.stringify({
			accounts: this.state.accounts,
			txns: txns.map(data => {
				const txn = {
					type: data.type,
					params: data.values,
				}
				if (data.fee) {
					txn.fee = Number(data.fee)
				}
				if (data.flatFee) {
					txn.flatFee = data.flatFee
				}
				if (data.lease) {
					txn.lease = data.lease
				}
				if (data.signMethod === 'regular') {
					txn.signers = data.signer ? [data.signer] : data.values.from ? [data.values.from] : []
				} else if (data.signMethod === 'multisig') {
					txn.signers = (data.signers || '').split(',').map(x => x.trim())
				} else if (data.signMethod === 'contract-account') {
					txn.lsig = {
						program: data.program ? `base64:${data.program}` : '',
						args: data.args,
					}
				} else if (data.signMethod === 'delegated-approval') {
					txn.lsig = {
						program: data.program ? `base64:${data.program}` : '',
						args: data.args,
						signer: data.signer || '',
					}
				}
				return txn
			})
		}, null, 2)

		this.setState({ txns, txnsJson })
	}

	getTxn = async () => {
		const txn = await this.modal.current.openModal()
		return withLabel(txn)
	}

	onClickLabel = async data => {
		const updated = await this.modal.current.openModal(data)
		return withLabel(updated)
	}

	exportTxns = async () => {
		await instanceChannel.invoke('exportTxns', this.state.txnsJson, window.workspaceRoot)
	}

	importTxns = async () => {
		const txnsJson = await instanceChannel.invoke('importTxns', window.workspaceRoot)
		try {
			const txnsObject = JSON.parse(txnsJson)
			this.setState({ accounts: txnsObject.accounts })
			const txns = txnsObject.txns.map(txn => {
				const data = {
					type: txn.type,
					values: txn.params,
					fee: txn.fee,
					flatFee: txn.flatFee,
					lease: txn.lease,
				}
				if (txn.lsig) {
					if (txn.lsig.signer) {
						data.signMethod = 'delegated-approval'
						data.program = txn.lsig.program.replace(`base64:`, '')
						data.args = txn.lsig.args
						data.signer = txn.lsig.signer
					} else {
						data.signMethod = 'contract-account'
						data.program = txn.lsig.program.replace(`base64:`, '')
						data.args = txn.lsig.args
					}
				} else if (txn.signers) {
					if (txn.signers.length <= 1) {
						data.signMethod = 'regular'
						data.signer = txn.signers[0] || ''
					} else {
						data.signMethod = 'multisig'
						data.signers = txn.signers.join(',\n')
					}
				} else {
					data.signMethod = 'regular'
					data.signer = ''
				}
				return data
			})
			this.onChange(txns.map(withLabel))
		} catch (e) {
			instanceChannel.invoke('showWarningMessage', 'Fail to parse the selected file.')
		}
	}

	chooseKeysPath = () => {}
	
  render () {
    return (
			<Card
				title='Transaction'
				right={(
					<PushTransactionButton
						running={this.props.running}
						algoSdk={this.props.algoSdk}
						keysFile={this.state.keysFile}
						txnsJson={this.state.txnsJson}
						workspaceRoot={window.workspaceRoot}
					/>
				)}
			>
				<FormGroup>
					<Label>Transaction Array</Label>
					<MultiSelect
						options={this.options}
						value={this.state.txns}
						onChange={this.onChange}
						onClickLabel={this.onClickLabel}
					/>
        </FormGroup>
				<FormGroup>
          <Label>Keys</Label>
          <InputGroup>
            <Input
							size='sm'
              placeholder={`Default: ${window.workspaceRoot}/keys.json`}
              value={this.state.keysFile}
              onChange={e => this.setState({ keysFile: e.target.value })}
            />
            {/* <InputGroupAddon addonType='append'>
              <Button color='secondary' onClick={this.chooseKeysPath}>
                Choose...
              </Button>
            </InputGroupAddon> */}
          </InputGroup>
        </FormGroup>
				<FormGroup>
					<div className='d-flex flex-row justify-content-between align-items-center'>
						<Label>Transaction Object</Label>
						<ButtonGroup>
							<Button color='primary' size='sm' onClick={this.exportTxns}><i className='fas fa-file-import mr-1' />Export</Button>
							<Button color='primary' size='sm' onClick={this.importTxns}><i className='fas fa-file-export mr-1' />Import</Button>
						</ButtonGroup>
					</div>
					<pre className='pre-box my-0 small'>{this.state.txnsJson}</pre>
				</FormGroup>
        <TransactionModal
					ref={this.modal}
        />
      </Card>
    )
  }
}


