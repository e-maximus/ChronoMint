import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Paper } from 'material-ui'

import { AddCurrencyDialog } from 'components'
import { modalsOpen } from 'redux/modals/actions'

import './InfoPartial.scss'

// TODO: @ipavlenko: MINT-234 - Remove when icon property will be implemented
const ICON_OVERRIDES = {
  ETH: require('assets/img/icn-ethereum.svg'),
  // LHUS: require('assets/img/icn-lhus.svg'),
  TIME: require('assets/img/icn-time.svg')
}

export class InfoPartial extends React.Component {

  static propTypes = {
    account: PropTypes.string,
    profile: PropTypes.object,
    tokens: PropTypes.object,
    isTokensLoaded: PropTypes.bool,
    addCurrency: PropTypes.func
  }

  render() {

    if (!this.props.isTokensLoaded) return null

    let tokens = this.props.tokens.entrySeq().toArray()

    let items = tokens.map(([name, token]) => ({
      token: token,
      name: name
    }))

    return (
      <div styleName="root">
        <div styleName="absolute">
          { items.map((item) => this.renderItem(item)) }
          { this.renderAction() }
        </div>
      </div>
    )
  }

  renderItem({ name, token }) {

    let icon = token.icon() || ICON_OVERRIDES[name.toUpperCase()]
    let symbol = token.symbol()
    let [value1, value2] = ('' + (token.balance() || 0).toFixed(8)).split('.')

    return (
      <div styleName="outer">
        <Paper zDepth={1}>
          <div styleName="inner">
            <div styleName="icon">
              <div styleName="content" style={{ backgroundImage: `url("${icon}")` }}></div>
              <div styleName="label">{symbol}</div>
            </div>
            <div styleName="info">
              <div styleName="label">Balance:</div>
              <div styleName="value">
                <span styleName="value1">{value1}</span>
                {!value2 ? null : (
                  <span styleName="value2">.{value2}</span>
                )}&nbsp;
                <span styleName="value2">{symbol}</span>
              </div>
            </div>
          </div>
        </Paper>
      </div>
    )
  }

  renderAction() {
    return (
      <div key="action" styleName="outer" onTouchTap={() => { this.props.addCurrency() }}>
        <Paper zDepth={1}>
          <div styleName="inner-action">
            <div styleName="title">
              <h3>Add Token</h3>
            </div>
          </div>
        </Paper>
      </div>
    )
  }
}

function mapDispatchToProps (dispatch) {
  return {
    addCurrency: (data) => dispatch(modalsOpen({
      component: AddCurrencyDialog,
      data
    }))
  }
}


function mapStateToProps (state) {
  let session = state.get('session')
  let wallet = state.get('wallet')

  return {
    account: session.account,
    profile: session.profile,
    isTokensLoaded: !wallet.tokensFetching,
    tokens: wallet.tokens
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(InfoPartial)
