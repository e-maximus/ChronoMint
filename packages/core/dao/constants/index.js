/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

/**
 * WARNING!
 * The constants below are duplicated in packages/login/network/constants.js
 * to make @chronobank/login package indenpendent
*/

export const BCC = 'BCC'
export const BTC = 'BTC'
export const DASH = 'DASH'
export const ETH = 'ETH'
export const LHT = 'LHT'
export const LTC = 'LTC'
export const TIME = 'TIME'
export const WAVES = 'WAVES'
export const XEM = 'XEM'

export const BLOCKCHAIN_BITCOIN = 'Bitcoin'
export const BLOCKCHAIN_BITCOIN_CASH = 'Bitcoin Cash'
export const BLOCKCHAIN_DASH = 'Dash'
export const BLOCKCHAIN_ETHEREUM = 'Ethereum'
export const BLOCKCHAIN_LABOR_HOUR = 'Labor Hour Token'
export const BLOCKCHAIN_LITECOIN = 'Litecoin'
export const BLOCKCHAIN_NEM = 'NEM'
export const BLOCKCHAIN_WAVES = 'WAVES'
export const BLOCKCHAIN_EOS = 'EOS'

export const TESTNET = 'Testnet'

export const DECIMALS_ETHEREUM = 18

export const TX_FRONTEND_ERROR_CODES = {
  FRONTEND_UNKNOWN: 'f0',
  FRONTEND_OUT_OF_GAS: 'f1',
  FRONTEND_CANCELLED: 'f2',
  FRONTEND_WEB3_FILTER_FAILED: 'f3',
  FRONTEND_RESULT_FALSE: 'f4',
  FRONTEND_RESULT_TRUE: 'f5',
  FRONTEND_INVALID_RESULT: 'f6',
}

export const DEFAULT_TX_OPTIONS = {
  addDryRunFrom: null,
  addDryRunOkCodes: [],
  allowNoReturn: false,
  useDefaultGasLimit: false,
  additionalAction: null,
  feeMultiplier: null,
}

export const DEFAULT_GAS = 4700000

export const EVENT_APPROVAL_TRANSFER = 'TokenApprovalTransfer'
export const EVENT_NEW_BLOCK = 'TokenNewBlock'
export const EVENT_NEW_TOKEN = 'newToken'
export const EVENT_NEW_TRANSFER = 'TokenTxTransfer'
export const EVENT_UPDATE_BALANCE = 'TokenUpdateBalance'
export const EVENT_UPDATE_LAST_BLOCK = 'updateLastBlock'
export const EVENT_UPDATE_TRANSACTION = 'TokenUpdateTransaction'

//#endregion
