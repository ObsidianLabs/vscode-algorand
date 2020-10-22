import React, { PureComponent } from 'react'

import {
	Card,
	MultiSelect,
	FormGroup,
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
			keysFile: `${window.workspaceRoot}/keys`
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
					txn.signers = data.signer ? [data.signer] : data.from ? [data.from] : []
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
              placeholder={`Default: ${window.workspaceRoot}/keys`}
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
					<Label>Transaction Object</Label>
					<pre className='pre-box my-0 small'>{this.state.txnsJson}</pre>
				</FormGroup>
        <TransactionModal
					ref={this.modal}
        />
      </Card>
    )
  }
}


