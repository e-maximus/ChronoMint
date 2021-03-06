/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import WalletContent from 'layouts/partials/WalletContent/WalletContent'
import React, { Component } from 'react'

import './WalletPage.scss'

export default class WalletPage extends Component {
  render () {
    return (
      <div styleName="root">
        <WalletContent />
      </div>
    )
  }
}
