/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import AbstractAccountModel from './AbstractAccountModel'
import AccountEntryModel from './AccountEntryModel'

const schema = {
  entry: PropTypes.instanceOf(AccountEntryModel),
  privateKey: PropTypes.string,
}

class AccountModel extends AbstractAccountModel {
  constructor (props) {
    super(props, schema)
    Object.assign(this, props)
    Object.freeze(this)
  }
}

export default AccountModel
