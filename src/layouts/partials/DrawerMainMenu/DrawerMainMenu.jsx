import { Link } from 'react-router'
import networkService from '@chronobank/login/network/NetworkService'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import classnames from 'classnames'
import { connect } from 'react-redux'
import menu from 'menu'
import { drawerHide, drawerToggle } from 'redux/drawer/actions'
import { logout, DUCK_SESSION } from 'redux/session/actions'
import chronWalletLogoSVG from 'assets/img/chronowallettext-white.svg'
import ProfileModel from 'models/ProfileModel'
import profileImgJPG from 'assets/img/profile-photo-1.jpg'
import { IPFSImage } from 'components'
import exitSvg from 'assets/img/exit-white.svg'
import { getWalletsCount } from 'redux/wallet/selectors'
import MenuTokensList from './MenuTokensList/MenuTokensList'

import './DrawerMainMenu.scss'

function mapStateToProps (state) {
  const { isCBE, profile } = state.get(DUCK_SESSION)

  return {
    walletsCount: getWalletsCount()(state),
    isCBE,
    profile,
    isDrawerOpen: state.get('drawer').isOpen,
    networkName: networkService.getName(),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    handleDrawerToggle: () => dispatch(drawerToggle()),
    handleDrawerHide: () => dispatch(drawerHide()),
    handleLogout: () => dispatch(logout()),
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class DrawerMainMenu extends PureComponent {
  static propTypes = {
    isCBE: PropTypes.bool,
    handleDrawerToggle: PropTypes.func,
    handleDrawerHide: PropTypes.func,
    profile: PropTypes.instanceOf(ProfileModel),
    networkName: PropTypes.string,
    handleLogout: PropTypes.func,
    walletsCount: PropTypes.number,
  }

  renderItem (item) {
    return (
      <Link
        activeClassName='drawer-item-active'
        to={{ pathname: item.path }}
        href
        key={item.key}
        styleName={classnames('menuItem', 'item')}
      >
        <i styleName='icon' className='material-icons'>{item.icon}</i>
        <div styleName='title'>
          <Translate value={item.title} />
        </div>
      </Link>
    )
  }

  render () {

    return (
      <div
        styleName='root'
        className={classnames(this.props.isCBE ? 'root-cbe' : null, 'root-open')}
      >

        <div styleName='content'>

          <div styleName='chronWalletLogo'>
            <img src={chronWalletLogoSVG} alt='ChronoWallet logo' />
          </div>

          <div styleName={classnames('account-info', 'item')}>
            <div styleName='account-info-avatar'>
              <div styleName='avatar-icon'>
                <IPFSImage
                  styleName='avatar-icon-content'
                  multihash={this.props.profile.icon()}
                  icon={<div styleName='emptyAvatar'><img src={profileImgJPG} alt='avatar' /></div>}
                />
              </div>
            </div>
            <div styleName='account-info-name'>
              <div styleName='account-name-text'>
                {this.props.profile.name() || 'Account name'}
              </div>
              <div styleName='network-name-text'>
                {this.props.networkName}
              </div>
            </div>
            <div styleName='exit' onTouchTap={this.props.handleLogout}>
              <img src={exitSvg} alt='logout' />
            </div>
          </div>

          <Link
            activeClassName='drawer-item-active'
            to='/wallet'
            href
            styleName={classnames('menuItem', 'item')}
          >
            <i styleName='icon' className='material-icons'>account_balance_wallet</i>
            <div styleName='title'>
              <Translate value='Wallets' />
            </div>
            <div styleName='count'>{this.props.walletsCount}</div>
          </Link>

          <MenuTokensList />

          {!menu.user ? null : (
            <div styleName='menu-user'>
              {menu.user.map((item) => this.renderItem(item))}
              {this.props.isCBE && menu.cbe.map((item) => this.renderItem(item))}
            </div>
          )}

          <div styleName='socialItems'>
            <a href='https://www.facebook.com/ChronoBank.io' target='_blank' rel='noopener noreferrer' styleName='socialItem'>
              <i styleName='facebook' />
            </a>
            <a href='https://twitter.com/ChronobankNews' target='_blank' rel='noopener noreferrer' styleName='socialItem'>
              <i styleName='twitter' />
            </a>
            <a href='https://www.instagram.com/chronobank.io/' target='_blank' rel='noopener noreferrer' styleName='socialItem'>
              <i styleName='instagram' />
            </a>
            <a href='https://www.reddit.com/r/ChronoBank/' target='_blank' rel='noopener noreferrer' styleName='socialItem'>
              <i styleName='reddit-alien' />
            </a>
            <a href='https://telegram.me/ChronoBank' target='_blank' rel='noopener noreferrer' styleName='socialItem'>
              <i styleName='telegram' />
            </a>
            <a href='https://github.com/ChronoBank' target='_blank' rel='noopener noreferrer' styleName='socialItem'>
              <i styleName='github' />
            </a>
          </div>

          <div styleName='contacts'>
            <a href='mailto:info@chronobank.io'>info@chronobank.io</a>
            <a href='mailto:support@chronobank.io'>support@chronobank.io</a>
          </div>
        </div>
      </div>
    )
  }
}