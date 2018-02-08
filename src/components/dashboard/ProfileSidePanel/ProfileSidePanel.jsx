import { connect } from "react-redux"
import PropTypes from "prop-types"
import React, { PureComponent } from 'react'
import { FlatButton, FontIcon, Drawer } from 'material-ui'
import { CopyIcon, QRIcon } from 'components'
import GasSlider from 'components/common/GasSlider/GasSlider'
import { getNetworkById } from '@chronobank/login/network/settings'
import ls from 'utils/LocalStorage'

import { sidesClose } from 'redux/sides/actions'

import './ProfileSidePanel.scss'

export const PROFILE_SIDE_PANEL_KEY = 'ProfileSidePanelKey'

function mapStateToProps (state) {
  const session = state.get('session')
  const wallet = state.get('mainWallet')
  const watcher = state.get('watcher')
  const monitor = state.get('monitor')
  return {
    wallet,
    account: session.account,
    profile: session.profile,
    transactionsList: watcher.pendingTxs,
    network: getNetworkById(ls.getNetwork(), ls.getProvider(), true).name,
    isTokensLoaded: !wallet.isFetching(),
    tokens: wallet.tokens(),
    networkStatus: monitor.network,
    syncStatus: monitor.sync,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    handleProfileClose: (panelKey) => {
      dispatch(sidesClose(panelKey))
    },
  }
}

@connect(mapStateToProps, mapDispatchToProps)
class ProfileSidePanel extends PureComponent {

  static propTypes = {
    network: PropTypes.string,
    account: PropTypes.string,
    profile: PropTypes.object,
    tokens: PropTypes.object,
    isTokensLoaded: PropTypes.bool,
    transactionsList: PropTypes.object,
    networkStatus: PropTypes.object,
    syncStatus: PropTypes.object,

    handleLogout: PropTypes.func,
    handleProfileEdit: PropTypes.func,
    handleDrawerToggle: PropTypes.func,
    readNotices: PropTypes.func,
    handleProfileClose: PropTypes.func,
  }

  renderProfile () {
    const items = !this.props.isTokensLoaded
      ? []
      : this.props.tokens.entrySeq().toArray().map(([ name, token ]) => ({ token, name }))

    const addressesInWallet = this.props.wallet.addresses()
    const addresses = [
      { title: 'BTC', address: addressesInWallet.item('Bitcoin').address() },
      { title: 'BTG', address: addressesInWallet.item('Bitcoin Gold').address() },
      { title: 'LTC', address: addressesInWallet.item('Litecoin').address() },
      { title: 'NEM', address: addressesInWallet.item('NEM').address() },
    ]
    return (
      <div styleName='profile'>
        <div styleName='profile-body'>
          <div styleName='body-info'>
            <div styleName='badge-green'>{this.props.network}</div>
            <div styleName='info-account'>{this.props.profile.name()}</div>
            <div styleName='info-company'>{this.props.profile.company()}</div>
            <div styleName='info-address'>{this.props.account}</div>
            <div styleName='info-micros'>
              <QRIcon value={this.props.account} />
              <CopyIcon
                value={this.props.account}
                onModalOpen={this.handleClickOutside}
              />
            </div>
            {addresses.filter((a) => a.address).map((a) => (
              <div key={a.title}>
                <div styleName='infoAddress'><b>{a.title}: </b>{a.address}</div>
                <div styleName='info-micros'>
                  <QRIcon value={a.address} />
                  <CopyIcon
                    value={a.address}
                    onModalOpen={this.handleClickOutside}
                  />
                </div>
              </div>
            ))}
            <div styleName='info-balances'>
              {items
                .filter((item) => ([ 'TIME', 'ETH', 'BTC', 'BTG', 'BCC', 'LTC', 'XEM', 'XMIN' ].indexOf(item.token.symbol().toUpperCase()) >= 0))
                .map((item) => this.renderBalance(item))}
            </div>
          </div>
        </div>
        <div styleName='profile-fee-slider'>
          <GasSlider />
        </div>
        <div styleName='profile-footer'>
          <FlatButton
            label='Edit Account'
            primary
            icon={<FontIcon className='material-icons'>edit</FontIcon>}
            onTouchTap={this.handleProfileEdit}
          />
          <FlatButton
            label='LOGOUT'
            primary
            icon={<FontIcon className='material-icons'>power_settings_new</FontIcon>}
            onTouchTap={() => {
              this.props.handleProfileClose(PROFILE_SIDE_PANEL_KEY)
            }}
          />
        </div>
      </div>
    )
  }

  render () {
    return (
      <Drawer
        openSecondary={true}
        open={true}
        width={360}
      >
        {this.renderProfile()}
      </Drawer>
    )
  }
}

export default ProfileSidePanel
