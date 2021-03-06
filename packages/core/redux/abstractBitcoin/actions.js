/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import * as BtcConstants from './constants'

export const bitcoinTxReject = (entry) => ({
  type: BtcConstants.BITCOIN_TX_REJECT,
  entry,
  isRejected: true,
})

export const bitcoinExecuteTx = () => ({
  type: BtcConstants.BITCOIN_EXECUTE_TX,
})

export const bitcoinExecuteTxSuccess = (data) => ({
  type: BtcConstants.BITCOIN_EXECUTE_TX_SUCCESS,
  data,
})

export const bitcoinExecuteTxFailure = (error) => ({
  type: BtcConstants.BITCOIN_EXECUTE_TX_FAILURE,
  error,
})

export const bitcoinHttpGetUtxos = () => ({
  type: BtcConstants.BITCOIN_HTTP_GET_UTXOS,
})

export const bitcoinHttpGetUtxosSuccess = (data) => ({
  type: BtcConstants.BITCOIN_HTTP_GET_UTXOS_SUCCESS,
  data,
})

export const bitcoinHttpGetUtxosFailure = (error) => ({
  type: BtcConstants.BITCOIN_HTTP_GET_UTXOS_FAILURE,
  error,
})
