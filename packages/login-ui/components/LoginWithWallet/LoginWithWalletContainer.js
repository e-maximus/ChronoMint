/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { stopSubmit } from 'redux-form'
import {
  FORM_WALLET_UPLOAD, navigateBack,
} from '../../redux/actions'
import LoginWithWallet from './LoginWithWallet'

const mapDispatchToProps = (dispatch) => {
  return {
    navigateBack: () => dispatch(navigateBack()),
  }
}

class LoginWithWalletContainer extends PureComponent {
  static propTypes = {
    previousPage: PropTypes.func,
    onSubmitSuccess: PropTypes.func,
  }

  async handleSubmit (walletString) {
    const { onSubmit } = this.props

    onSubmit && await onSubmit(walletString)
  }

  handleSubmitSuccess (result) {
    const { onSubmitSuccess } = this.props

    onSubmitSuccess && onSubmitSuccess(result)
  }

  handleSubmitFail (errors, dispatch, submitErrors) {
    dispatch(stopSubmit(FORM_WALLET_UPLOAD, submitErrors && submitErrors.errors))
  }

  render () {
    return (
      <LoginWithWallet
        onSubmit={this.handleSubmit.bind(this)}
        onSubmitSuccess={this.handleSubmitSuccess.bind(this)}
        onSubmitFail={this.handleSubmitFail.bind(this)}
        previousPage={this.props.navigateBack}
      />
    )
  }
}

export default connect(null, mapDispatchToProps)(LoginWithWalletContainer)
