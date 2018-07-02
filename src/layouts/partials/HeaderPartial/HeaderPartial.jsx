/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Immutable from "immutable"
import { Button, TopButtons } from 'components'
import { sidesPush } from 'redux/sides/actions'
import { pendingTransactionsSelector } from '@chronobank/core/redux/mainWallet/selectors/tokens'
import TxModel from '@chronobank/core/models/TxModel'
import { DUCK_WATCHER } from '@chronobank/core/redux/watcher/actions'

import NotificationContent, { NOTIFICATION_PANEL_KEY } from 'layouts/partials/NotificationContent/NotificationContent'
import LocaleDropDown from 'layouts/partials/LocaleDropDown/LocaleDropDown'

import './HeaderPartial.scss'

function mapStateToProps (state) {
  const { pendingTxs } = state.get(DUCK_WATCHER)

  return {
    ethPendingTransactions: pendingTxs,
    btcPendingTransactions: pendingTransactionsSelector()(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    handleNotificationTap: () => {
      dispatch(sidesPush({
        component: NotificationContent,
        panelKey: NOTIFICATION_PANEL_KEY,
        isOpened: true,
        direction: 'right',
      }))
    },
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export default class HeaderPartial extends Component {
  static propTypes = {
    handleNotificationTap: PropTypes.func,
    btcPendingTransactions: PropTypes.arrayOf(TxModel),
    ethPendingTransactions: PropTypes.instanceOf(Immutable.Map),
    location: PropTypes.shape({
      action: PropTypes.string,
      hash: PropTypes.string,
      key: PropTypes.string,
      pathname: PropTypes.string,
      query: PropTypes.object,
      search: PropTypes.string,
      state: PropTypes.string,
    }),
  }

  getNotificationButtonClass = () => {
    return this.props.btcPendingTransactions.length || this.props.ethPendingTransactions.size > 0 ? 'pending' : 'raised'
  }

  render () {
    const buttonClass = this.getNotificationButtonClass()

    return (
      <div styleName='root'>
        <div styleName='actions'>
          <TopButtons location={this.props.location} />

          <LocaleDropDown />

          <Button styleName='action' buttonType={buttonClass} onClick={this.props.handleNotificationTap}>
            <i className='material-icons'>notifications</i>
          </Button>
        </div>
      </div>
    )
  }

}
