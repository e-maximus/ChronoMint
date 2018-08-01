/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

export const EE_MS_WALLET_ADDED = 'MSWalletAdded'
export const EE_MS_WALLET_REMOVED = 'MSWalletRemoved'
export const EE_MS_WALLETS_COUNT = 'msWalletCount'

export const EVENT_NEW_TRANSFER = 'TokenTxTransfer'
export const EVENT_UPDATE_TRANSACTION = 'TokenUpdateTransaction'
export const EVENT_UPDATE_BALANCE = 'TokenUpdateBalance'
export const EVENT_UPDATE_LAST_BLOCK = 'updateLastBlock'
export const FETCH_NEW_BALANCE = 'TokenFetchNewBalance'
export const EVENT_MODIFY_BALANCE = 'TokenModifyBalance'
export const EVENT_APPROVAL_TRANSFER = 'TokenApprovalTransfer'

// #region PendingManagerDao.js

// to distinguish equal operations between completed and pending lists
export const PENDING_ID_PREFIX = 'P-'

export const TX_CONFIRM = 'confirm'
export const TX_REVOKE = 'revoke'
export const OPERATIONS_PER_PAGE = 10

// #endregion PendingManagerDao.js

// #region VotingManagerDao.js

export const TX_CREATE_POLL = 'createPoll'
export const TX_REMOVE_POLL = 'removePoll'
export const TX_ACTIVATE_POLL = 'activatePoll'

export const EVENT_POLL_CREATED = 'PollCreated'
export const EVENT_POLL_UPDATED = 'PollUpdated'
export const EVENT_POLL_REMOVED = 'PollRemoved'

// #endregion VotingManagerDao.js

// #region LHTDAO.js

export const LHT = 'LHT'

// #endregion LHTDAO.js

// #region Blockchains' names

export const BLOCKCHAIN_ETHEREUM = 'Ethereum'
export const BLOCKCHAIN_NEM = 'NEM'
export const BLOCKCHAIN_WAVES = 'WAVES'

// #endregion

// #region WavesDAO.js

export const WAVES_WAVES_SYMBOL = 'WAVES'
export const WAVES_WAVES_NAME = 'WAVES'
export const WAVES_DECIMALS = 8

// #endregion WavesDAO.js

// #region AbstractContractDAO.js

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

// #endregion AbstractContractDAO.js
