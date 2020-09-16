import React, { PureComponent } from 'react'

import {
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledButtonDropdown
} from '@obsidians/ui-components'

export default class DownloadImageButton extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      loading: false,
      versions: [],
    }
  }

  get channel () {
    return this.props.channel
  }

  componentDidMount () {
    this.fetchRemoteVersions()
  }

  fetchRemoteVersions = async () => {
    this.setState({ loading: true })
    let versions
    try {
      versions = await this.channel.remoteVersions()
    } catch (e) {
      this.setState({ loading: false })
      console.warn(e)
      return
    }

    this.setState({ loading: false, versions })
  }

  onSelectVersion = async downloadVersion => {
		await this.channel.download(downloadVersion)
    this.props.onDownloaded()
  }

  renderVersions = () => {
    const { loading, versions } = this.state
    if (loading) {
      return (
        <DropdownItem key='icon-loading-versions'>
          <i className='fas fa-spin fa-spinner mr-1' />Loading...
        </DropdownItem>
      )
    }

    if (!versions.length) {
      return <DropdownItem disabled>(None)</DropdownItem>
    }

    return versions.map(({ name }) => (
      <DropdownItem key={name} onClick={() => this.onSelectVersion(name)}>{name}</DropdownItem>
    ))
  }

  render () {
    const imageName = this.channel.imageName
    const {
      installDropdownHeader = 'Available Versions',
      size,
      color = 'secondary',
      right,
    } = this.props
    return (
      <React.Fragment>
        <UncontrolledButtonDropdown size={size}>
          <DropdownToggle
            caret
            color={color}
            onClick={() => this.fetchRemoteVersions()}
          >
            <i className='fas fa-download mr-1' />Install
          </DropdownToggle>
          <DropdownMenu right={right}>
            <DropdownItem header className='small'>{installDropdownHeader}</DropdownItem>
            {this.renderVersions()}
          </DropdownMenu>
        </UncontrolledButtonDropdown>
      </React.Fragment>
    )
  }
}
