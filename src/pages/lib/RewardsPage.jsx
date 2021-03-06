/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import RewardsContent from 'layouts/partials/RewardsContent/RewardsContent'
import React, { Component } from 'react'

import './RewardsPage.scss'

export default class RewardsPage extends Component {
  render () {
    return (
      <div styleName="root">
        <RewardsContent />
      </div>
    )
  }
}
