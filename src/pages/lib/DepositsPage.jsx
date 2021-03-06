/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import DepositsContent from 'layouts/partials/DepositsContent/DepositsContent'
import React, { PureComponent } from 'react'

import './DepositsPage.scss'

export default class DepositsPage extends PureComponent {
  render () {
    return (
      <div styleName="root">
        <DepositsContent />
      </div>
    )
  }
}
