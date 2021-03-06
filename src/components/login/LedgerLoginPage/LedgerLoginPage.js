/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { onCreateWalletFromDevice } from '@chronobank/login-ui/redux/thunks'
import { WALLET_TYPE_LEDGER } from '@chronobank/core/models/constants/AccountEntryModel'
import {
  navigateToSelectWallet,
  navigateBack,
} from '@chronobank/login-ui/redux/navigation'
import LoginWithLedgerContainer from '@chronobank/login-ui/components/LoginWithLedger/LoginWithLedgerContainer'
import AccountNameContainer from '@chronobank/login-ui/components/AccountName/AccountNameContainer'
import DerivationPathFormContainer from '@chronobank/login-ui/components/DerivationPathForm/DerivationPathFormContainer'
import * as ProfileThunks from '@chronobank/core/redux/profile/thunks'
import { getAddress } from '@chronobank/core/redux/persistAccount/utils'

function mapDispatchToProps (dispatch) {
  return {
    getUserInfo: (addresses: string[]) => dispatch(ProfileThunks.getUserInfo(addresses)),
    navigateToSelectWallet: () => dispatch(navigateToSelectWallet()),
    onCreateWalletFromDevice: (name, device, profile) => dispatch(onCreateWalletFromDevice(name, device, profile, WALLET_TYPE_LEDGER)),
    navigateBack: () => dispatch(navigateBack()),
  }
}

class LedgerLoginPage extends PureComponent {
  static PAGES = {
    DEVICE_SELECT_FORM: 1,
    ACCOUNT_NAME_FORM: 2,
    DERIVATION_PATH_FORM: 3,
  }

  static propTypes = {
    getUserInfo: PropTypes.func,
    navigateToSelectWallet: PropTypes.func,
    navigateBack: PropTypes.func,
    onCreateWalletFromDevice: PropTypes.func,
  }

  constructor (props) {
    super(props)

    this.state = {
      page: LedgerLoginPage.PAGES.DEVICE_SELECT_FORM,
    }
  }

  getCurrentPage () {
    switch(this.state.page){
    case LedgerLoginPage.PAGES.DEVICE_SELECT_FORM:
      return (
        <LoginWithLedgerContainer
          previousPage={this.previousPage.bind(this)}
          onDeviceSelect={this.onSubmitDevice.bind(this)}
          navigateToDerivationPathForm={this.navigateToDerivationPathForm.bind(this)}
        />
      )

    case LedgerLoginPage.PAGES.ACCOUNT_NAME_FORM:
      return (
        <AccountNameContainer
          previousPage={this.previousPage.bind(this)}
          onSubmit={this.onSubmitAccountName.bind(this)}
        />
      )

    case LedgerLoginPage.PAGES.DERIVATION_PATH_FORM:
      return (
        <DerivationPathFormContainer
          previousPage={this.navigateToDeviceSelectForm.bind(this)}
          onSubmit={this.onSubmitDerivationPath.bind(this)}
        />
      )

    default:
      return (
        <LoginWithLedgerContainer
          previousPage={this.previousPage.bind(this)}
          onDeviceSelect={this.onSubmitDevice.bind(this)}
        />
      )
    }
  }

  async onSubmitDevice (device) {
    this.setState({
      device,
    })

    let response = null, userName = null, profile = null

    // If profile has been got && profile does exist && userName != null then create wallet
    try {
      response = await this.props.getUserInfo([getAddress(device.address, true)])

      profile = response.data[0]
      userName = profile.userName

      if (userName){
        this.props.onCreateWalletFromDevice(userName, device, profile)
        this.props.navigateToSelectWallet()
      } else {
        this.setState({
          page: LedgerLoginPage.PAGES.ACCOUNT_NAME_FORM,
        })
      }

    } catch (e) {
      this.setState({
        page: LedgerLoginPage.PAGES.ACCOUNT_NAME_FORM,
      })
    }
  }

  async onSubmitAccountName (accountName) {
    const { onCreateWalletFromDevice, navigateToSelectWallet } = this.props

    onCreateWalletFromDevice(accountName, this.state.device, null)
    navigateToSelectWallet()
  }

  async onSubmitDerivationPath () {
    this.setState({
      page: LedgerLoginPage.PAGES.DEVICE_SELECT_FORM,
    })
  }

  navigateToDerivationPathForm () {
    this.setState({
      page: LedgerLoginPage.PAGES.DERIVATION_PATH_FORM,
    })
  }

  navigateToDeviceSelectForm () {
    this.setState({
      page: LedgerLoginPage.PAGES.DEVICE_SELECT_FORM,
    })
  }

  previousPage () {
    if (this.state.page === LedgerLoginPage.PAGES.DEVICE_SELECT_FORM){
      this.props.navigateBack()
    } else {
      this.setState ({ page: this.state.page - 1 })
    }
  }

  render () {
    return this.getCurrentPage()
  }
}

export default connect(null, mapDispatchToProps)(LedgerLoginPage)
