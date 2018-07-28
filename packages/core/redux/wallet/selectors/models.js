/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { DUCK_ETH_MULTISIG_WALLET } from '../../multisigWallet/actions'
import { DUCK_MARKET } from '../../market/actions'
import { DUCK_TOKENS } from '../../tokens/actions'

/**
 * SIMPLE SELECTORS
 * ==============================================================================
 */

export const getMultisigWallets = (state) => {
  return state.get(DUCK_ETH_MULTISIG_WALLET)
}

export const selectTokensStore = (state) =>
  state.get(DUCK_TOKENS) // TokensCollection, array of TokenModel

export const selectMarketPricesListStore = (state) => state.get(DUCK_MARKET).prices
export const selectMarketPricesSelectedCurrencyStore = (state) => state.get(DUCK_MARKET).selectedCurrency

