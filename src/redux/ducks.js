/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { combineReducers } from 'redux-immutable'

import coreReducers from '@chronobank/core/redux/ducks'
import loginReducers from '@chronobank/login/redux/ducks'
import drawer from './drawer'
import modals from './modals'
import sides from './sides'
import ui from './ui'

const appReducers = combineReducers({
  coreReducers,
  drawer,
  loginReducers,
  modals,
  sides,
  ui,
})

export default appReducers
