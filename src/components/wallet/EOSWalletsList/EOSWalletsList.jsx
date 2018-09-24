/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { getEosWallets } from '@chronobank/core/redux/eos/selectors/mainSelectors'
import { BLOCKCHAIN_EOS } from '@chronobank/core/redux/eos/constants'
import WalletModel from '@chronobank/core/models/wallet/WalletModel'
import { DUCK_UI } from 'redux/ui/constants'
import EOSWalletWidget from '../EOSWalletWidget/EOSWalletWidget'
import './EOSWalletsList.scss'
import { prefix } from './lang'

function makeMapStateToProps (state) {
  const { isCompactWalletView } = state.get(DUCK_UI)
  return {
    isCompactWalletView,
    eosWalletsList: getEosWallets(state),
  }
}

@connect(makeMapStateToProps)
export default class EOSWalletsList extends PureComponent {
  static propTypes = {
    isCompactWalletView: PropTypes.bool,
    eosWalletsList: PropTypes.objectOf(PropTypes.instanceOf(WalletModel)),
  }

  render () {
    const Component = this.props.isCompactWalletView ? null : EOSWalletWidget // TODO implement mini widget for
    const list = Object.values(this.props.eosWalletsList)

    return (
      <div styleName='root'>
        <h1 styleName='header-text'><Translate value={`${prefix}.title`} /></h1>
        {list.length > 0 ? (
          <div styleName='walletsList'>
            {list.map((wallet) => {
              return (
                <Component
                  key={`${BLOCKCHAIN_EOS}-${wallet.address}`}
                  blockchain={BLOCKCHAIN_EOS}
                  address={wallet.address}
                />
              )
            })}
          </div>
        ) : null
        }
      </div>
    )
  }
}
