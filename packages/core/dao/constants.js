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

// #region Blockchain names

export const BLOCKCHAIN_ETHEREUM = 'Ethereum'

// #endregion
