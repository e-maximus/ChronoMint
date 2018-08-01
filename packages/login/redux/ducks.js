/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { combineReducers } from 'redux-immutable'

import ledger from './ledger'
import trezor from './trezor'
import network from './network'
import monitor from './monitor'

const loginReducers = combineReducers({
  network,
  monitor,
  ledger,
  trezor,
})

export default loginReducers
