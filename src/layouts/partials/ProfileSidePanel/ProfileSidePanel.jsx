import { connect } from "react-redux"
import PropTypes from "prop-types"
import React, { PureComponent } from 'react'
import { logout } from 'redux/session/actions'
import { getProfileTokensList } from 'redux/session/selectors'
import {  FontIcon, Drawer } from 'material-ui'
import { modalsOpen } from 'redux/modals/actions'
import { IPFSImage, QRIcon, PKIcon, CopyIcon, UpdateProfileDialog } from 'components'
import ProfileModel from 'models/ProfileModel'

import GasSlider from 'components/common/GasSlider/GasSlider'
import networkService from '@chronobank/login/network/NetworkService'
import { TOKEN_ICONS } from 'assets'
import { sidesClose } from 'redux/sides/actions'

import './ProfileSidePanel.scss'

export const PROFILE_SIDE_PANEL_KEY = 'ProfileSidePanelKey'

function mapStateToProps (state) {
  const session = state.get('session')
  return {
    account: session.account,
    profile: session.profile,
    networkName: networkService.getName(),
    tokens: getProfileTokensList()(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    handleProfileEdit: (data) => dispatch(modalsOpen({
      component: UpdateProfileDialog,
      data,
    })),
    handleLogout: () => dispatch(logout()),
    handleProfileClose: (panelKey) => {
      dispatch(sidesClose(panelKey))
    },
  }
}

@connect(mapStateToProps, mapDispatchToProps)
class ProfileSidePanel extends PureComponent {

  static propTypes = {
    networkName: PropTypes.string,
    account: PropTypes.string,
    profile: PropTypes.instanceOf(ProfileModel),
    tokens: PropTypes.arrayOf(PropTypes.object),

    handleLogout: PropTypes.func,
    handleProfileEdit: PropTypes.func,
    handleDrawerToggle: PropTypes.func,
    readNotices: PropTypes.func,
    handleProfileClose: PropTypes.func,
  }

  handleProfileClose = () => {
    this.props.handleProfileClose(PROFILE_SIDE_PANEL_KEY)
  }

  renderProfile () {

    return (
      <div styleName='profile'>

        <div styleName='close-icon' onTouchTap={this.handleProfileClose}>
          <FontIcon color='white' className='material-icons'>clear</FontIcon>
        </div>

        <div styleName='network-name'>
          <div styleName='network-name-text'>
            {this.props.networkName}
          </div>
        </div>

        <div styleName='account-info'>
          <div styleName='account-info-avatar'>
            <div styleName='avatar-icon'>
              <IPFSImage
                styleName='avatar-icon-content'
                multihash={this.props.profile.icon()}
                icon={
                  <FontIcon
                    style={{ fontSize: 60, cursor: 'default' }}
                    color='white'
                    className='material-icons'
                  >account_circle
                  </FontIcon>
                }
              />
            </div>
          </div>
          <div styleName='account-info-name'>
            <div styleName='account-name-text'>
              {this.props.profile.name() || 'Account name'}
            </div>
          </div>
          <div styleName='account-info-icons'>
            <div styleName='account-info-setting' onTouchTap={this.props.handleProfileEdit}>
              <FontIcon color='white' className='material-icons'>settings</FontIcon>
            </div>
            <div styleName='account-info-setting' onTouchTap={this.props.handleLogout}>
              <FontIcon color='white' className='material-icons'>power_settings_new</FontIcon>
            </div>
          </div>
        </div>

        <div styleName='main-address'>
          <div styleName='main-address-account'>
            <div styleName='main-address-header-text'>Main address</div>
            <div styleName='main-address-account-name'>{this.props.account}</div>
          </div>
          <div styleName='main-address-icons'>
            <div styleName='address-qr-code'>
              <QRIcon iconStyle='average' value={this.props.account} />
            </div>
            <div styleName='address-copy-icon'>
              <CopyIcon iconStyle='average' value={this.props.account} />
            </div>
            <div styleName='address-pk-icon'>
              <PKIcon iconStyle='average' blockchain='Ethereum' />
            </div>
          </div>
        </div>

        {this.props.tokens
          .map((token) => {
            return (
              <div styleName='address' key={token.blockchain}>
                <div styleName='address-info'>
                  <div styleName='address-token'>
                    <IPFSImage
                      styleName='address-token-icon'
                      fallback={TOKEN_ICONS[ token.symbol ]}
                    />
                  </div>
                  <div styleName='address-token-info'>
                    <div styleName='address-info-text'>{token.title} Address</div>
                    <div styleName='main-address-account-name'>{ token.address }</div>
                  </div>
                </div>
                <div styleName='address-icons'>
                  <div styleName='address-qr-code'>
                    <QRIcon iconStyle='average' value={token.address} />
                  </div>
                  <div styleName='address-copy-icon'>
                    <CopyIcon iconStyle='average' value={token.address} />
                  </div>
                  <div styleName='address-pk-icon'>
                    <PKIcon iconStyle='average' blockchain={token.blockchain} />
                  </div>
                </div>
              </div>
            )
          })
        }

        <div styleName='address-split-hr' />

        <div styleName='profile-fee-slider'>
          <GasSlider />
        </div>
      </div>
    )
  }

  render () {
    return (
      <Drawer
        openSecondary
        open
        overlayStyle={{ opacity: 0 }}
        onRequestChange={this.handleProfileClose}
        swipeAreaWidth={380}
        width={380}
        docked={false}
      >
        {this.renderProfile()}
      </Drawer>
    )
  }
}

export default ProfileSidePanel
