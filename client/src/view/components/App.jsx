import React, { PureComponent } from 'react'

import './scss/index.scss'

import AlgoSdk from '../AlgoSdk'
import Instance from './Instance'
import Transaction from './Transaction'

export default class App extends PureComponent {
	state = {
		running: false,
		algoSdk: null,
	}

	onLifecycle = ({ lifecycle, params }) => {
		let algoSdk
		if (lifecycle === 'started') {
			algoSdk = new AlgoSdk(params)
		}
		this.setState({ algoSdk, running: lifecycle === 'started' })
	}

	render () {
		return (
			<div className='d-flex flex-column h-100 py-3'>
				<h1>Algorand Panel</h1>
				<div>
					<Instance onLifecycle={this.onLifecycle} />
				</div>
				<div className='mt-3 flex-grow-1'>
					<Transaction running={this.state.running} algoSdk={this.state.algoSdk} />
				</div>
			</div>
		)
	}
}

