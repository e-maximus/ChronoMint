/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { Translate } from 'react-redux-i18n'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { TX_CONFIRMATIONS } from 'assets'
import { DUCK_WALLET } from '@chronobank/core/redux/wallet/constants'
import { makeGetLastBlockForBlockchain } from '@chronobank/core/redux/tokens/selectors'
import {
  BLOCKCHAIN_BITCOIN,
  BLOCKCHAIN_BITCOIN_CASH,
  BLOCKCHAIN_ETHEREUM,
  BLOCKCHAIN_LABOR_HOUR,
  BLOCKCHAIN_LITECOIN,
} from '@chronobank/core/dao/constants'
import TxDescModel from '@chronobank/core/models/TxDescModel'
import { prefix } from './lang'
import './TxConfirmations.scss'

function mapStateToProps (state, ownProps) {
  return {
    latestBlock: makeGetLastBlockForBlockchain(ownProps.transaction.value.symbol())(state),
    account: state.get(DUCK_WALLET).address,
  }
}

@connect(mapStateToProps)
export default class TxConfirmations extends PureComponent {
  static propTypes = {
    transaction: PropTypes.instanceOf(TxDescModel).isRequired,
    latestBlock: PropTypes.shape({
      blockNumber: PropTypes.number,
    }),
    account: PropTypes.string,
    textMode: PropTypes.bool,
  }

  getBlockMiningTime = (blockchain: string) => {
    switch (blockchain) {
    case BLOCKCHAIN_BITCOIN:
    case BLOCKCHAIN_BITCOIN_CASH:
    case BLOCKCHAIN_LITECOIN:
      return 600

    case BLOCKCHAIN_ETHEREUM:
    case BLOCKCHAIN_LABOR_HOUR:
      return 30

    default:
      return 0
    }
  }

  renderConfirmations (confirmations) {
    const { account, transaction } = this.props
    let icon = null
    const isFrom = transaction.from.split(',').some((from) => from === account)
    const prefix = (!isFrom) ? 's' : 'r'

    if (confirmations <= 4) {
      icon = TX_CONFIRMATIONS[`${prefix}_${confirmations}`]
    } else {
      icon = TX_CONFIRMATIONS[`${prefix}_4`]
    }

    return <img src={icon} alt='' />
  }

  renderText () {
    const { transaction, latestBlock, textMode } = this.props
    let confirmations = 0
    if (latestBlock && latestBlock.blockNumber && transaction.blockNumber > 0) {
      confirmations = latestBlock.blockNumber - transaction.blockNumber + 1
    } else {
      confirmations = transaction.confirmations
    }

    if (textMode) {
      let remaning
      const miningTime = this.getBlockMiningTime(transaction.blockchain)
      if (confirmations < 4) {
        remaning = (4 - confirmations) * miningTime
        return <Translate value={`${prefix}.confirmations`} min={Math.ceil(remaning / 60)} confirmations={confirmations} />
      } else {
        return <Translate value={`${prefix}.done`} />
      }
    }
  }

  render () {
    const { transaction, latestBlock, textMode } = this.props
    let confirmations = 0
    if (latestBlock && latestBlock.blockNumber && transaction.blockNumber > 0) {
      confirmations = latestBlock.blockNumber - transaction.blockNumber + 1
    } else {
      confirmations = transaction.confirmations
    }

    return (
      <div styleName='root' className='TxConfirmations__root'>
        {
          textMode
            ? this.renderText()
            : this.renderConfirmations(confirmations)
        }
      </div>
    )
  }
}
