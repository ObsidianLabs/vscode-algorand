import React, { PureComponent } from 'react'

import nodeManager from './nodeManager'

export default class NodeButton extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      lifecycle: 'stopped'
    }
	}
	
	componentDidMount () {
		if (this.props.running) {
			this.start()
		}
	}

  componentWillUnmount () {
    if (this.state.lifecycle !== 'stopped') {
      this.stop()
    }
  }

  onLifecycle = (lifecycle, params) => {
    // nodeManager.updateLifecycle(lifecycle, params)
    if (this.props.onLifecycle) {
      this.props.onLifecycle(lifecycle, params)
    }
  }

  start = async () => {
    if (this.state.lifecycle !== 'stopped') {
      return
    }
    this.setState({ lifecycle: 'starting' })
    this.onLifecycle('starting')

    nodeManager.start({
      name: this.props.name,
      version: this.props.version,
      chain: this.props.chain,
    }, {
			onStart: params => {
				this.setState({ lifecycle: 'started' })
				this.onLifecycle('started', params)
			},
			onStop: () => {
				this.setState({ lifecycle: 'stopped' })
				this.onLifecycle('stopped')
			}
		})
  }

  stop = async () => {
    this.setState({ lifecycle: 'stopping' })
    this.onLifecycle('stopping')

    await nodeManager.stop({
      name: this.props.name,
      version: this.props.version,
      chain: this.props.chain,
    })

    this.setState({ lifecycle: 'stopped' })
    this.onLifecycle('stopped')
  }

  renderStartBtn () {
    return (
      <div key='node-btn-stopped-no-miner' className='btn-group btn-group-sm'>
        <button type='button' className='btn btn-success' onClick={() => this.start(false)}>
          <i className='fas fa-play mr-1' />Start
        </button>
      </div>
    )
  }

  render () {
    switch (this.state.lifecycle) {
      case 'stopped':
        return this.renderStartBtn()
      case 'started':
        return (
          <div key='node-btn-stop' className='btn btn-sm btn-danger' onClick={this.stop}>
            <i className='fas fa-stop mr-1' />Stop
          </div>
        )
      case 'starting':
        return (
          <div key='node-btn-starting' className='btn btn-sm btn-transparent'>
            <i className='fas fa-circle-notch fa-spin mr-1' />Starting
          </div> 
        )
      case 'stopping':
        return (
          <div key='node-btn-stopping' className='btn btn-sm btn-transparent'>
            <i className='fas fa-circle-notch fa-spin mr-1' />Stopping
          </div> 
        )
      default:
        return null
    }
  }
}
