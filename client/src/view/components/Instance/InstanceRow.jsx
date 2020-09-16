import React, { PureComponent } from 'react'

import {
  Button,
  DeleteButton,
} from '@obsidians/ui-components'

import { NodeButton, NodeStatus } from '../Node'

import instanceChannel from './instanceChannel'

export default class InstanceRow extends PureComponent {
  renderStartStopBtn = (name, version, chain) => {
		if (this.props.lifecycle !== 'stopped' && this.props.runningInstance !== name) {
			return null
		}
    return (
      <NodeButton
				running={this.props.data.running}
        name={name}
        version={version}
				chain={chain}
        onLifecycle={(lifecycle, params) => this.props.onNodeLifecycle(name, lifecycle, params)}
      />
    )
  }

  renderVersionBtn = version => {
    return (
      <div className='btn btn-sm btn-primary'>
        <i className='fas fa-code-merge mr-1' />
        <b>{version}</b>
      </div>
    )
  }

  renderChainBtn = chain => {
    return (
      <div className='btn btn-sm btn-primary'>
        <b>{chain}</b>
      </div>
    )
  }

  renderBlockNumber = name => {
    if (this.props.runningInstance !== name) {
      return null
    }
  //   return <NodeStatus />
  }

  deleteInstance = async name => {
    await instanceChannel.invoke('delete', name)
    this.props.onRefresh()
  }

  render () {
    const data = this.props.data
    const name = data.Name.substr(9)
    const labels = data.Labels

    return (
      <tr>
        <td>
          <div className='flex-row align-items-center'>
            {name}
          </div>
        </td>
        <td>{this.renderStartStopBtn(name, labels.version, labels.chain)}</td>
        <td>{this.renderVersionBtn(labels.version)}</td>
        <td>{this.renderChainBtn(labels.chain)}</td>
        <td>{this.renderBlockNumber(name)}</td>
        <td align='right'>
          <DeleteButton onConfirm={() => this.deleteInstance(name)} />
        </td>
      </tr>
    )
  }
}
