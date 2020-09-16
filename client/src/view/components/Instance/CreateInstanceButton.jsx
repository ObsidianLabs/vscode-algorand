import React, { PureComponent } from 'react'

import {
  Button,
  Modal,
  DebouncedFormGroup,
} from '@obsidians/ui-components'

import instanceChannel from './instanceChannel'
import DockerImageInputSelector from './docker/DockerImageInputSelector'

export default class CreateInstanceButton extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      loading: false,
      versions: [],
      name: '',
      version: '',
      pending: false,
    }

    this.modal = React.createRef()
    this.terminal = React.createRef()
  }

  onClickButton = () => {
    this.modal.current.openModal()
  }

  onCreateInstance = async () => {
    this.setState({ pending: 'Creating...' })

    await instanceChannel.invoke('create', {
      name: this.state.name,
      version: this.state.version,
		})
		
    this.modal.current.closeModal()
    this.setState({ pending: false })
    this.props.onRefresh()
  }

  render () {
    return (
      <React.Fragment>
        <Button
          key='new-instance'
          color='success'
          className={this.props.className}
          onClick={this.onClickButton}
        >
          <i className='fas fa-plus mr-1' />
          New Instance
        </Button>
        <Modal
					ref={this.modal}
					overflow
          title='New Instance'
          textConfirm='Create'
					onConfirm={this.onCreateInstance}
					onClosed={() => instanceChannel.invoke('cancelCreate')}
          pending={this.state.pending}
          confirmDisabled={!this.state.name || !this.state.version}
        >
          <DebouncedFormGroup
            label='Instance name'
            placeholder='Can only contain alphanumeric characters, dots, hyphens or underscores.'
            maxLength='50'
            value={this.state.name}
            onChange={name => this.setState({ name })}
          />
					<DockerImageInputSelector
            channel={instanceChannel.node}
            label='Algorand version'
            noneName='Algorand node'
            modalTitle='Algorand Version Manager'
            downloadingTitle='Downloading Algorand'
            selected={this.state.version}
            onSelected={version => this.setState({ version })}
          />
        </Modal>
      </React.Fragment>
    )
  }
}
