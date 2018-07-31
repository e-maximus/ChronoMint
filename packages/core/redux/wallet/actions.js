/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { WALLET_SELECT_WALLET } from './constants'

// eslint-disable-next-line import/prefer-default-export
export const selectWallet = (blockchain: string, address: string) => (dispatch) => {
  dispatch({ type: WALLET_SELECT_WALLET, blockchain, address })
}
