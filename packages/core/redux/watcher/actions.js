/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { watchInitMonitor } from '@chronobank/login/redux/monitor/actions'
import { watchInitUserMonitor, txHandlingFlow } from '@chronobank/core-dependencies/redux/ui/actions'
import { watchInitTokens, watchPlatformManager } from '../assetsManager/actions'
import { watchInitLOC } from '../locs/actions'
import { initMainWallet } from '../mainWallet/actions'
import { watchInitMarket } from '../market/actions'
import { notify } from '../notifier/actions'
import { watchInitOperations } from '../operations/actions'
import { watchInitCBE } from '../settings/user/cbe/actions'
import { initTokens } from '../tokens/actions'
import { initDAOs } from '../../refactor/redux/daos/actions'
import { watchInitPolls } from '../voting/actions'
import { initMultisigWalletManager } from '../multisigWallet/actions'
import { initWallets } from '../wallets/actions'
import { daoByType } from '../../refactor/redux/daos/selectors'
import {
  WATCHER_CBE,
  WATCHER,
} from './constants'

// for all users on all pages
export const globalWatcher = () => async (dispatch) => {
  dispatch(watchInitMonitor())
}

export const watchInitProfile = () => async (dispatch, getState) => {
  const userManagerDAO = daoByType('UserManager')(getState())
  return userManagerDAO.watchProfile((notice) => dispatch(notify(notice)))
}

// for all logged in users
export const watcher = ({ web3 }) => async (dispatch) => {
  await dispatch(initDAOs({ web3 }))
  dispatch(initMultisigWalletManager())
  dispatch(watchInitProfile())
  dispatch(initTokens())
  dispatch(initMainWallet())
  dispatch(initWallets())
  dispatch(watchPlatformManager())
  dispatch(watchInitTokens())
  dispatch(watchInitMonitor())
  dispatch(watchInitUserMonitor())
  dispatch(watchInitMarket())
  // TODO @Abdulov fix it
  // dispatch(watchInitERC20Tokens())
  dispatch(watchInitPolls())
  dispatch(txHandlingFlow())
  dispatch({ type: WATCHER })
}

// only for CBE
export const cbeWatcher = () => async (dispatch) => {
  dispatch({ type: WATCHER_CBE })
  // settings
  dispatch(watchInitCBE())
  dispatch(watchInitLOC())
  dispatch(watchInitOperations())
}
