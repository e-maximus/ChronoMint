/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { combineReducers } from 'redux-immutable'

import assetsHolder from './assetsHolder'
import assetsManager from './assetsManager'
import dao from './daos'
import ethMultisigWallet from './multisigWallet'
import exchange from './exchange'
import locs from './locs'
import mainWallet from './mainWallet'
import market from './market'
import notifier from './notifier'
import operations from './operations'
import persistAccount from './persistAccount'
import rewards from './rewards'
import session from './session'
import settingsErc20Tokens from './settings/erc20/tokens'
import settingsUserCBE from './settings/user/cbe'
import tokens from './tokens'
import transactions from './transactions'
import voting from './voting'
import wallet from './wallet'
import wallets from './wallets'
import watcher from './watcher'
import web3 from './web3'

const coreReducers = {
  assetsHolder,
  assetsManager,
  dao,
  ethMultisigWallet,
  exchange,
  locs,
  mainWallet,
  market,
  notifier,
  operations,
  persistAccount,
  rewards,
  session,
  settingsErc20Tokens,
  settingsUserCBE,
  tokens,
  transactions,
  voting,
  wallet,
  wallets,
  watcher,
  web3,
}

export default coreReducers

// for further development
export const combinedCoreReducers = combineReducers(coreReducers)
