import React, { PureComponent } from 'react'

import { Card } from '@obsidians/ui-components'

import CreateInstanceButton from './CreateInstanceButton'

import InstanceHeader from './InstanceHeader'
import InstanceRow from './InstanceRow'

import instanceChannel from './instanceChannel'

export default class InstanceList extends PureComponent {
	static defaultProps = {
    chain: 'testnet',
    onLifecycle: () => {},
	}
	
	state = {
		loading: false,
		lifecycle: 'stopped',
		runningInstance: '',
		instances: [],
	}

  componentDidMount() {
    this.refreshInstances()
  }
  
  refreshInstances = async () => {
		this.setState({ loading: true })
		try {
			const instances = await instanceChannel.invoke('list')
			this.setState({ instances, loading: false })
		} catch(e) {
			this.setState({ loading: false })
		}
	}
	
	onNodeLifecycle = (name, lifecycle, params) => {
    const runningState = {
      lifecycle,
      params,
      runningInstance: name,
    }
    this.setState(runningState)
    if (lifecycle === 'stopped') {
      // notification.info(`Algorand Instance Stopped`, `Algorand instance <b>${name}</b> stops to run.`)
    } else if (lifecycle === 'started') {
      // notification.success(`Algorand Instance Started`, `Algorand instance <b>${name}</b> is running now.`)
    }
    this.props.onLifecycle(runningState)
  }

  renderTable = () => {
    return (
      <table className='table table-sm table-hover table-striped'>
        <InstanceHeader />
        <tbody>
          {this.renderTableBody()}
        </tbody>
      </table>
    )
  }

  renderTableBody = () => {
		if (this.state.loading) {
      return <tr><td align='center' colSpan={6} key='loading'><i className='fas fa-spin fa-spinner mr-1' />Loading...</td></tr>
		}

		if (!this.state.instances) {
      return <tr><td align='center' colSpan={6}>(Docker not started. Please install and start Docker first)</td></tr>
		}

    if (!this.state.instances.length) {
      return <tr><td align='center' colSpan={6}>(No Algorand instance)</td></tr>
		}
		
    return this.state.instances.map(data => (
      <InstanceRow
        key={`instance-${data.Name}`}
        data={data}
        runningInstance={this.state.runningInstance}
        lifecycle={this.state.lifecycle}
				onRefresh={this.refreshInstances}
        onNodeLifecycle={this.onNodeLifecycle}
      />
    ))
  }

  render () {
    return (
			<Card
				title={`Algorand Instances`}
				right={
					<CreateInstanceButton
						className='ml-2'
						onRefresh={this.refreshInstances}
					/>
				}
			>
				{this.renderTable()}
			</Card>
    )
  }
}