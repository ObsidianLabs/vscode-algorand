import React, { PureComponent } from 'react'

import {
  DropdownInput,
} from '@obsidians/ui-components'

import DockerImageManager from './DockerImageManager'

export default class DockerImageInputSelector extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      loading: true,
      versions: [],
    }

    this.modal = React.createRef()
  }

  get imageName() {
    return this.props.channel?.imageName || this.props.imageName
  }

  onRefreshVersions = versions => {
    if (!this.props.selected && versions.length) {
      this.props.onSelected(versions[0].Tag)
    }
    this.setState({
      loading: false,
      versions: versions.map(v => ({ id: v.Tag, display: v.Tag })),
    })
  }

  openManager = () => {
    this.modal.current.openModal()
  }

  render () {
    let versions = this.state.versions
    if (!versions.length) {
      versions.push({ id: 'none', display: `(No ${this.props.noneName || this.imageName} installed)`, disabled: true })
    }
    return (
      <React.Fragment>
        <DropdownInput
          label={this.props.label || this.imageName}
          options={[
            { children: this.state.versions },
            {
              id: 'manager',
              display: <span key='manager'><i className='fas fa-cog mr-1' />{this.props.modalTitle}...</span>,
              onClick: this.openManager,
            }
          ]}
          value={this.props.selected}
          onChange={this.props.onSelected}
        />
        <DockerImageManager
          ref={this.modal}
          {...this.props}
          onRefresh={this.onRefreshVersions}
        />
      </React.Fragment>
    )
  }
}
