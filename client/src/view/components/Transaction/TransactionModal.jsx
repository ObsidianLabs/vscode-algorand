import React, { PureComponent } from 'react'

import {
	Modal,
	DebouncedFormGroup,
	DropdownInput,
	CustomInput,
	Label,
} from '@obsidians/ui-components'

import pick from 'lodash/pick'

const fieldsByType = {
	pay: [
		{ label: 'From', name: 'from', tooltip: 'The address that sends the amount' },
		{ label: 'To', name: 'to', tooltip: 'The address that receives the amount' },
		{ label: 'Amount', name: 'amount', tooltip: 'The total amount to be sent in ALGO' },
		{
			label: 'Close Remainder To',
			name: 'closeRemainderTo',
			tooltip: 'When set, all remaining balance will be transferred to this address and the sender account will be closed'
		},
	],
	'asset-create': [
		{ label: 'From', name: 'from', tooltip: 'The address that sends the transaction' },
		{ label: 'Asset Name', name: 'name', tooltip: 'Name of the asset (e.g. Tether)' },
		{ label: 'Asset Unit', name: 'unit', tooltip: 'Name of unit of the asset (e.g. USDT)' },
		{ label: 'Asset Total', name: 'total', tooltip: 'Total number of the asset in base units' },
		{ label: 'Asset Decimals', name: 'decimals', tooltip: 'Number of digits to use after the decimal point' },
		{ label: 'Asset URL', name: 'url', tooltip: 'A URL where more info can be retrieved; max 32 bytes' },
		{ label: 'Asset Meta', name: 'meta', tooltip: 'A 32-byte hash of some metadata that is relevant to your asset' },
		{
			label: 'Asset Manager',
			name: 'manager',
			placeholder: 'Default: From',
			tooltip: 'An address that can manage the asset and destroy it.',
		},
		{
			label: 'Asset Reserve',
			name: 'reserve',
			tooltip: 'An address that holds the non-minted units of the asset',
		},
		{
			label: 'Asset Frozen',
			name: 'freeze',
			tooltip: 'An address that holds frozen asset. If empty, freezing is not permitted.',
		},
		{
			label: 'Asset Clawback',
			name: 'clawback',
			tooltip: 'An address that can clawback holdings of this asset. If empty, clawback is not permitted.',
		},
		{ label: 'Asset Default Frozen', name: 'defaultFrozen', type: 'boolean' },
	],
	'asset-modify': [
		{ label: 'From', name: 'from', tooltip: `The address that sends the transaction; must be the assets's manager address` },
		{ label: 'Asset ID', name: 'assetId', tooltip: 'ID of the asset' },
		{
			label: 'Asset Manager',
			name: 'manager',
			tooltip: 'An address that can manage the asset and destroy it.',
		},
		{
			label: 'Asset Reserve',
			name: 'reserve',
			tooltip: 'An address that holds the non-minted units of the asset',
		},
		{
			label: 'Asset Frozen',
			name: 'freeze',
			tooltip: 'An address that holds frozen asset. If empty, freezing is not permitted.',
		},
		{
			label: 'Asset Clawback',
			name: 'clawback',
			tooltip: 'An address that can clawback holdings of this asset. If empty, clawback is not permitted.',
		},
	],
	'asset-freeze': [
		{ label: 'From', name: 'from', tooltip: `The address that sends the transaction; must be the asset's freeze address` },
		{ label: 'Asset ID', name: 'assetId', tooltip: 'ID of the asset' },
		{ label: 'Freeze Account', name: 'target', tooltip: 'The address whose asset will be frozen or unfrozen' },
		{ label: 'Freeze State', name: 'state', type: 'boolean' },
	],
	'asset-destroy': [
		{ label: 'From', name: 'from', tooltip: `The address that sends the transaction; must be the assets's manager address` },
		{ label: 'Asset ID', name: 'assetId', tooltip: 'ID of the asset' },
	],
	'asset-opt-in': [
		{ label: 'From', name: 'from', tooltip: 'The address that sends the transaction' },
		{ label: 'Asset ID', name: 'assetId', tooltip: 'ID of the asset' },
	],
	'asset-transfer': [
		{ label: 'From', name: 'from', tooltip: `The address that sends the transaction; must be the asset's clawback address if Clawback Target is given` },
		{ label: 'To', name: 'to', tooltip: 'The address that receives the asset' },
		{ label: 'Asset ID', name: 'assetId', tooltip: 'ID of the asset' },
    { label: 'Amount', name: 'amount', tooltip: 'The total amount to be sent in base units' },
    {
			label: 'Close Remainder To',
			name: 'closeRemainderTo',
			tooltip: 'When set, all remaining asset balance will be transferred to this address'
		},
		{
      label: 'Clawback Target',
      name: 'clawback',
      tooltip: `Indicates a clawback if set. This value is the address from which assets will be withdrawn.`
    },
	],
	'keyreg': [
		{ label: 'From', name: 'from', tooltip: 'The address that sends the transaction' },
		{ label: 'Vote Key', name: 'vote', tooltip: 'The root participation public key' },
		{ label: 'Selection Key', name: 'selection', tooltip: 'The VRF public key' },
		{ label: 'Vote First', name: 'first', tooltip: 'The first round that the participation key is valid' },
		{ label: 'Vote Last', name: 'last', tooltip: 'The last round that the participation key is valid' },
		{ label: 'Vote Key Dilution', name: 'dilution', tooltip: 'The dilution for the 2-level participation key' },
	],
}

export default class TransactionModal extends PureComponent {
	constructor (props) {
		super(props)
		this.modal = React.createRef()
		this.state = {
			type: 'pay',
			signMethod: 'regular',
			values: {},
			signer: '',
			signers: '',
			fee: '',
			flatFee: false,
			note: undefined,
			lease: '',
		}
	}

	openModal = async data => {
		if (data) {
			this.setState({
				type: data.type,
				signMethod: data.signMethod,
				values: { ...data.values },
				signer: data.signer,
				signers: data.signers,
				program: data.program,
				fee: data.fee,
				flatFee: data.flatFee,
				note: data.note,
				lease: data.lease,
			})
		} else {
			this.setState({
				type: 'pay',
				signMethod: 'regular',
				values: {},
				signer: '',
				program: '',
				fee: '',
				flatFee: false,
				note: undefined,
				lease: '',
			})
		}
		this.modal.current.openModal()
		return new Promise(resolve => this.onResolve = resolve)
	}

	onConfirm = () => {
		const fieldNames = fieldsByType[this.state.type].map(f => f.name)
		this.onResolve({
			...this.state,
			values: pick(this.state.values, fieldNames)
		})
		this.modal.current.closeModal()
	}

	onChangeType = type => {
		this.setState({ type })
	}

	renderTransactionForm = fields => {
		return fields.map(({ label, name, tooltip, placeholder, type }) => {
			const value = this.state.values[name]
			const onChange = value => {
				this.setState({ values: {
					...this.state.values,
					[name]: value,
				}})
			}
			if (type) {
				return (
					<CustomInput
						key={`field-${name}`}
						id={`field-${name}`}
						type='checkbox'
						label={label}
						className='small font-weight-bold'
						checked={!!value}
						onChange={event => onChange(event.target.checked)}
					/>
				)
			}
			return (
				<DebouncedFormGroup
					key={`field-${name}`}
					size='sm'
					tooltip={tooltip}
					placeholder={placeholder}
					label={label}
					value={value}
					onChange={onChange}
				/>
			)
		})
	}

	renderSigners = signMethod => {
		if (signMethod === 'regular') {
			return (
				<DebouncedFormGroup
					key='signer'
					size='sm'
					label='Signer'
					placeholder={`Default: ${this.state.values.from || 'From'}`}
					value={this.state.signer}
					onChange={signer => this.setState({ signer })}
				/>
			)
		} else if (signMethod === 'multisig') {
			return (
				<DebouncedFormGroup
					key='multisig'
          type='textarea'
					size='sm'
					label='Signers (seperated by ,)'
					value={this.state.signers}
					onChange={signers => this.setState({ signers })}
				/>
			)
		} else if (signMethod === 'contract-account') {
			return (
				<React.Fragment>
					<DebouncedFormGroup
						key='signer-program'
						size='sm'
						label='Path for the contract program'
						value={this.state.program}
						onChange={program => this.setState({ program })}
					/>
					{/* <DebouncedFormGroup
						key='signer-args'
						type='textarea'
						size='sm'
						label='Args (seperated by ,)'
						value={this.state.args}
						onChange={args => this.setState({ args })}
					/> */}
				</React.Fragment>
			)
		} else if (signMethod === 'delegated-approval') {
			return (
				<React.Fragment>
					<DebouncedFormGroup
						key='signer-program'
						size='sm'
						label='Path for the contract program'
						value={this.state.program}
						onChange={program => this.setState({ program })}
					/>
					{/* <DebouncedFormGroup
						key='signer-args'
						type='textarea'
						size='sm'
						label='Args (seperated by ,)'
						value={this.state.args}
						onChange={args => this.setState({ args })}
					/> */}
					<DebouncedFormGroup
						key='signer'
						size='sm'
						label='Signer'
						value={this.state.signer}
						onChange={signer => this.setState({ signer })}
					/>
				</React.Fragment>
			)
		}
	}

	renderOtherInputs = () => {
		return (
			<React.Fragment>
				<Label className='mt-2 mb-0'>Other Parameters</Label>
				<DebouncedFormGroup
					size='sm'
					label='Fee (in micro ALGO)'
					tooltip='Transaction fee paid by the sender; min 1000'
					placeholder='Default: 1000'
					value={this.state.fee}
					onChange={fee => this.setState({ fee })}
				/>
				<CustomInput
					id='flat-fee'
					type='checkbox'
					label='Flat Fee'
					className='small font-weight-bold'
					checked={this.state.flatFee}
        	onChange={event => this.setState({ flatFee: event.target.checked })}
				/>
				<DebouncedFormGroup
					size='sm'
					formGroupClassName='mt-1'
					label='Note'
					tooltip='Any message to be included in the transaction and up to 1000 bytes'
					value={this.state.note}
					onChange={note => this.setState({ note })}
				/>
				<DebouncedFormGroup
					size='sm'
					formGroupClassName='mt-1'
          label='Lease'
          tooltip='If set, it requires the (from, lease) pair to be unique until the LastValid round passes.'
					value={this.state.lease}
					onChange={lease => this.setState({ lease })}
				/>
			</React.Fragment>
		)
	}

  render () {
    return (
			<Modal
				ref={this.modal}
				wide
				title='Transaction'
				onConfirm={this.onConfirm}
			>
				<div className='row'>
					<div className='col-6'>
						<DropdownInput
							label='Transaction type'
							options={[
								{
									group: 'Regular',
									children: [
										{ id: 'pay', display: 'Pay' },
										{ id: 'keyreg', display: 'Key Registration' },
									],
								},
								{
									group: 'Asset',
									children: [
										{ id: 'asset-create', display: 'Create' },
										{ id: 'asset-opt-in', display: 'Opt In' },
										{ id: 'asset-transfer',	display: 'Transfer' },
										{ id: 'asset-modify',	display: 'Modify' },
										{ id: 'asset-freeze',	display: 'Freeze' },
										{ id: 'asset-destroy',	display: 'Destroy' },
									]
								},
							]}
							value={this.state.type}
							onChange={this.onChangeType}
						/>
						{this.renderTransactionForm(fieldsByType[this.state.type])}
					</div>
					<div className='col-6'>
						<DropdownInput
							label='Signing Method'
							options={[
								{ id: 'regular', display: 'Regular' },
								{ id: 'multisig', display: 'Multi Signature' },
								{ id: 'contract-account', display: 'LogicSig - Contract Account' },
								{ id: 'delegated-approval', display: 'LogicSig - Delegated Approval' },
							]}
							value={this.state.signMethod}
							onChange={signMethod => this.setState({ signMethod })}
						/>
						{this.renderSigners(this.state.signMethod)}
						{this.renderOtherInputs()}
					</div>
				</div>
			</Modal>
    )
  }
}