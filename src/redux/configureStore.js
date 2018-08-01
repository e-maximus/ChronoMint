/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Immutable from 'immutable'
// import { globalWatcher } from '@chronobank/core/redux/watcher/actions'

import { combineReducers } from 'redux-immutable'
import { applyMiddleware, compose, createStore } from 'redux'
import { createLogger } from 'redux-logger'
import { composeWithDevTools } from 'redux-devtools-extension'
import { persistStore } from 'redux-persist-immutable'
import moment from 'moment'
import thunk from 'redux-thunk'
import { reducer as formReducers } from 'redux-form/immutable'
import { I18n, i18nReducer, loadTranslations, setLocale } from '@chronobank/core-dependencies/i18n'
import { loadI18n } from 'redux/i18n/actions'
import { DUCK_I18N } from 'redux/i18n/constants'
import saveAccountMiddleWare from '@chronobank/core/redux/session/saveAccountMiddleWare'
import { DUCK_MAIN_WALLET } from '@chronobank/core/redux/mainWallet/constants'
import ls from '@chronobank/core-dependencies/utils/LocalStorage'
import ducks from './ducks'
import routingrReducers from './routing'
import transformer from './serialize'
import createHistory, { historyMiddleware } from './browserHistoryStore'
import translations from '../i18n'

const SESSION_DESTROY = 'session/DESTROY'

// eslint-disable-next-line no-unused-vars
let i18nJson // declaration of a global var for the i18n object for a standalone version

const configureStore = () => {
  const initialState = new Immutable.Map()

  const appReducer = combineReducers({
    form: formReducers,
    i18n: i18nReducer,
    routing: routingrReducers,
    ducks,
  })

  const rootReducer = (state, action) => {

    if (action.type === SESSION_DESTROY) {
      const i18nState = state.get('i18n')
      const mainWalletsState = state.get(DUCK_MAIN_WALLET)
      const walletsState = state.get('ethMultisigWallet')
      const persistAccount = state.get('persistAccount')
      state = new Immutable.Map()
      state = state
        .set('i18n', i18nState)
        .set('ethMultisigWallet', walletsState)
        .set('mainWallet', mainWalletsState)
        .set('persistAccount', persistAccount)
    }
    return appReducer(state, action)
  }

  const isDevelopmentEnv = process.env.NODE_ENV === 'development'
  const composeEnhancers = isDevelopmentEnv
    ? composeWithDevTools({ realtime: true })
    : compose
  const middleware = [
    thunk,
    historyMiddleware,
    saveAccountMiddleWare,
  ]

  if (isDevelopmentEnv) {
    // Highest priority, IGNORED_ACTIONS and DOMAINS are ignored by WHITE_LIST
    const WHITE_LIST = []
    // The following actions will be ignored if not whitelisted but presents in DOMAINS
    // So, we can enable whole domain, but still exclude aome actions from domain
    const IGNORED_ACTIONS = [
      'mainWallet/TOKEN_BALANCE',
      'market/UPDATE_LAST_MARKET',
      'market/UPDATE_PRICES',
      'market/UPDATE_RATES',
      'tokens/fetched',
    ]
    // All actions like network/* (starts with network)
    const DOMAINS = [
      'ethMultisigWallet/',
      'network/',
      '@@router/',
    ]
    const logger = createLogger({
      collapsed: true,
      predicate: (getState, action) => WHITE_LIST.includes(action.type) || (!IGNORED_ACTIONS.includes(action.type) && DOMAINS.some((domain) => action.type.startsWith(domain))),
    })
    // Note: logger must be the last middleware in chain, otherwise it will log thunk and promise, not actual actions
    middleware.push(logger)
  }

  // noinspection JSUnresolvedVariable,JSUnresolvedFunction
  const createStoreWithMiddleware = composeEnhancers(
    applyMiddleware(
      ...middleware,
    ),
  )(createStore)

  return createStoreWithMiddleware(
    rootReducer,
    initialState,
  )
}

export const store = configureStore()
// store.dispatch(globalWatcher())

const persistorConfig = {
  key: 'root',
  whitelist: ['ethMultisigWallet', 'mainWallet', 'persistAccount', 'wallets'],
  transforms: [transformer()],
}

// eslint-disable-next-line no-underscore-dangle
store.__persistor = persistStore(store, persistorConfig)

export const history = createHistory(store)

// syncTranslationWithStore(store) relaced with manual configuration in the next 6 lines
I18n.setTranslationsGetter(() => store.getState().get(DUCK_I18N).translations)
I18n.setLocaleGetter(() => store.getState().get(DUCK_I18N).locale)

const locale = ls.getLocale()
// set moment locale
moment.locale(locale)

store.dispatch(loadTranslations(translations))
store.dispatch(setLocale(locale))

// load i18n from the public site
store.dispatch(loadI18n(locale))
/** <<< i18n END */
