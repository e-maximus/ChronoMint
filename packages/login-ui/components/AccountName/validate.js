/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import ErrorList from 'utils/ErrorList'
import * as validator from '@chronobank/core/models/validator'

export default (values) => {

  const accountName = values.get('accountName')

  const accountNameErrors = new ErrorList()
  accountNameErrors.add(validator.required(accountName))

  return {
    accountName: accountNameErrors.getErrors(),
  }
}
