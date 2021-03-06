/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { REHYDRATE } from 'redux-persist'
import * as a from './constants'
import WalletModel from '../../models/wallet/WalletModel'

const initialState = {
  list: {},
  twoFAConfirmed: null,
}

export default (state = initialState, action) => {
  switch (action.type) {
  case REHYDRATE: {
    const incoming = action.payload.wallets
    if (incoming) {
      return {
        list: Object.entries(incoming.list)
          .reduce((accumulator, [key, wallet]) => {
            if (wallet.isDerived) {
              accumulator[key] = wallet
            }
            return accumulator
          }, {}),
      }
    }
    return state
  }
  case a.WALLETS_SET:
    return {
      ...state,
      list: {
        ...state.list,
        [action.wallet.id]: action.wallet,
      },
    }
  case a.WALLETS_UNSET: {
    const list = { ...state.list }
    delete list[action.wallet.id]
    return {
      ...state,
      list: {
        ...list,
      },
    }
  }
  case a.WALLETS_UPDATE_BALANCE:
    return {
      ...state,
      list: {
        ...state.list,
        [action.walletId]: new WalletModel({
          ...state.list[action.walletId],
          balances: {
            ...state.list[action.walletId].balances,
            [action.balance.symbol()]: action.balance,
          },
        }),
      },
    }
  case a.WALLETS_UPDATE_WALLET:
    return {
      ...state,
      list: {
        ...state.list,
        [action.wallet.id]: new WalletModel({ ...action.wallet }),
      },
    }
  case a.WALLETS_TWO_FA_CONFIRMED:
    return {
      ...state,
      twoFAConfirmed: action.twoFAConfirmed,
    }
  case a.WALLETS_SET_IS_TIME_REQUIRED:
    return {
      ...state,
      list: {
        ...state.list,
        [action.walletId]: new WalletModel({
          ...state.list[action.walletId],
          isTIMERequired: action.isTIMERequired,
        }),
      },
    }
  case a.WALLETS_SET_NAME:
    return {
      ...state,
      list: {
        ...state.list,
        [action.walletId]: new WalletModel({
          ...state.list[action.walletId],
          name: action.name,
        }),
      },
    }
  case a.WALLETS_LOGOUT:
    return {
      list: Object.entries(state.list)
        .reduce((accumulator, [key, wallet]) => {
          if (wallet.isDerived) {
            accumulator[key] = wallet
          }
          return accumulator
        }, {}),
    }
  default:
    return state
  }
}
