/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import OwnerModel from '@chronobank/core/models/wallet/OwnerModel'
import UserIcon from 'components/common/HashedIcon/UserIcon'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import './EditManagersBaseForm.scss'

class ManagerItem extends PureComponent {
  static propTypes = {
    manager: PropTypes.instanceOf(OwnerModel),
    onRemove: PropTypes.func.isRequired,
    account: PropTypes.string.isRequired,
  }

  handleRemoveManager = () => {
    this.props.onRemove(this.props.manager.address())
  }

  render () {
    const { manager, account } = this.props
    const address = manager.address()
    return (
      <div styleName='row'>
        <div styleName='iconBox'>
          <UserIcon styleName='icon' account={address} />
        </div>
        <div styleName='address'>{address}</div>
        {address !== account && (
          <button onClick={this.handleRemoveManager} styleName='action'>
            <i className='material-icons'>delete</i>
          </button>
        )}
      </div>
    )
  }
}

export default ManagerItem
