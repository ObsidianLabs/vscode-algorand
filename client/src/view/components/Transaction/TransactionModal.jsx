import React, { PureComponent } from 'react'

import {
	Modal,
	DebouncedFormGroup,
	DropdownInput,
	CustomInput,
	Label,
} from '@obsidians/ui-components'

const fieldsByType = {
	pay: [
		{ label: 'From', name: 'from' },
		{ label: 'To', name: 'to' },
		{ label: 'Amount', name: 'amount' },
		{ label: 'Note', name: 'note' },
		{ label: 'Close Remainder To', name: 'closeRemainderTo' },
	],
	'asset-create': [
		{ label: 'From', name: 'from' },
		{ label: 'Note', name: 'note' },
		{ label: 'Asset Name', name: 'name' },
		{ label: 'Asset Unit', name: 'unit' },
		{ label: 'Asset Total', name: 'total' },
		{ label: 'Asset Decimals', name: 'decimals' },
		{ label: 'Asset URL', name: 'url' },
		{ label: 'Asset Meta', name: 'meta' },
		{ label: 'Asset Manager', name: 'manager' },
		{ label: 'Asset Reserve', name: 'reserve' },
		{ label: 'Asset Frozen', name: 'freeze' },
		{ label: 'Asset Clawback', name: 'clawback' },
		{ label: 'Asset Default Frozen', name: 'defaultFrozen' },
	],
	'asset-modify': [
		{ label: 'From', name: 'from' },
		{ label: 'Note', name: 'note' },
		{ label: 'Asset ID', name: 'assetId' },
		{ label: 'Asset Manager', name: 'manager' },
		{ label: 'Asset Reserve', name: 'reserve' },
		{ label: 'Asset Frozen', name: 'freeze' },
		{ label: 'Asset Clawback', name: 'clawback' },
	],
	'asset-freeze': [
		{ label: 'From', name: 'from' },
		{ label: 'Note', name: 'note' },
		{ label: 'Asset ID', name: 'assetId' },
		{ label: 'Freeze Account', name: 'target' },
		{ label: 'Freeze State', name: 'state' },
	],
	'asset-destroy': [
		{ label: 'From', name: 'from' },
		{ label: 'Note', name: 'note' },
		{ label: 'Asset ID', name: 'assetId' },
	],
	'asset-opt-in': [
		{ label: 'From', name: 'from' },
		{ label: 'Note', name: 'note' },
		{ label: 'Asset ID', name: 'assetId' },
	],
	'asset-transfer': [
		{ label: 'From', name: 'from' },
		{ label: 'To', name: 'to' },
		{ label: 'Asset ID', name: 'assetId' },
		{ label: 'Amount', name: 'amount' },
		{ label: 'Close Remainder To', name: 'closeRemainderTo' },
		{ label: 'Asset Revocation Target', name: 'assetRevocationTarget' },
		{ label: 'Note', name: 'note' },
	],
	'keyreg': [
		{ label: 'From', name: 'from' },
		{ label: 'Note', name: 'note' },
		{ label: 'Vote Key', name: 'vote' },
		{ label: 'Selection Key', name: 'selection' },
		{ label: 'Vote First', name: 'first' },
		{ label: 'Vote Last', name: 'last' },
		{ label: 'Vote Key Dilution', name: 'dilution' },
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
				lease: '',
			})
		}
		this.modal.current.openModal()
		return new Promise(resolve => this.onResolve = resolve)
	}

	onConfirm = () => {
		this.onResolve({
			...this.state,
			values: { ...this.state.values }
		})
		this.modal.current.closeModal()
	}

	onChangeType = type => {
		this.setState({ type })
	}

	renderTransactionForm = fields => {
		return fields.map(({ label, name }, index) => {
			const value = this.state.values[name]
			const onChange = value => {
				this.setState({ values: {
					...this.state.values,
					[name]: value,
				}})
			}
			return (
				<DebouncedFormGroup
					size='sm'
					key={`field-${name}`}
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
					placeholder={`Default: ${this.state.values.from || '{From}'}`}
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
					label='Fee'
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
					label='Lease'
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