/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { getNetworkById } from '@chronobank/login/network/settings'
import { DUCK_NETWORK } from '@chronobank/login/redux/network/constants'
import { getCurrentNetworkSelector } from '@chronobank/login/redux/network/selectors'
import * as NetworkActions from '@chronobank/login/redux/network/actions'
import web3Provider from '@chronobank/login/network/Web3Provider'
import metaMaskResolver from '@chronobank/login/network/metaMaskResolver'
import { stopMarket } from '@chronobank/market/middleware/thunks'

import * as SessionActions from './actions'
import * as ProfileThunks from '../profile/thunks'
import ProfileService from '../profile/service'
import { daoByType } from '../../redux/daos/selectors'
import web3Factory from '../../web3'
import { watcher } from '../watcher/actions'
import { initEthereum } from '../ethereum/thunks'
import { DUCK_PERSIST_ACCOUNT } from '../persistAccount/constants'
import { DEFAULT_CBE_URL, DEFAULT_USER_URL, DUCK_SESSION } from './constants'
import { getAccountAddresses } from './selectors/session'
import { cleanWalletsList } from '../wallets/actions'

const ERROR_NO_ACCOUNTS = 'Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.'

export const checkMetaMask = () => (dispatch) => {
  const metaMaskHandler = (isMetaMask) => {
    if (isMetaMask) {
      dispatch(NetworkActions.setTestMetamask())
    }
  }

  metaMaskResolver
    .on('resolve', metaMaskHandler)
    .start()
}

export const getAccounts = () => (dispatch, getState) => {
  const state = getState()
  const accounts = state.get(DUCK_NETWORK).accounts
  return accounts
}

export const loadAccounts = () => async (dispatch) => {
  dispatch(NetworkActions.loading())
  dispatch(NetworkActions.networkSetAccounts([]))
  try {
    let accounts = dispatch(getAccounts())
    if (accounts == null) {
      accounts = await web3Provider.getAccounts()
    }
    if (!accounts || accounts.length === 0) {
      throw new Error(ERROR_NO_ACCOUNTS)
    }
    dispatch(NetworkActions.networkSetAccounts(accounts))
    if (accounts.length === 1) {
      dispatch(NetworkActions.selectAccount(accounts[0]))
    }
    dispatch(NetworkActions.loading(false))
    return accounts
  } catch (e) {
    dispatch(NetworkActions.addError(e.message))
  }
}

// TODO: unnecessary thunk, need to use getProviderSettings instead...
export const getProviderURL = () => (dispatch) => {
  const providerSettings = dispatch(getProviderSettings())
  return providerSettings.url
}

export const getProviderSettings = () => (dispatch, getState) => {
  const state = getState()
  return getCurrentNetworkSelector(state)
}

export const selectProvider = (selectedProviderId) => (dispatch) => {
  console.log('selectProvider: ', selectedProviderId)
  dispatch(NetworkActions.networkResetNetwork())
  dispatch(NetworkActions.networkSetProvider(selectedProviderId))
}

export const updateWeb3 = (selectedNetworkId, selectedProviderId) => (dispatch, getState) => {

  const state = getState()
  if (!selectedNetworkId || !selectedProviderId) {
    const network = state.get(DUCK_NETWORK)
    selectedNetworkId = network.selectedNetworkId
    selectedProviderId = network.selectedProviderId
  }

  const { customNetworksList } = state.get(DUCK_PERSIST_ACCOUNT)
  console.log('updateWeb3 customNetworksList: ', customNetworksList, selectedNetworkId, selectedProviderId)

  console.log('updateWeb3: ', selectedNetworkId, selectedProviderId)

  let network = getNetworkById(selectedNetworkId, selectedProviderId)
  console.log('updateWeb3 network: ', network)
  if (!network.id) {
    network = customNetworksList.find((network) => network.id === selectedNetworkId)
  }

  return new Promise((resolve, fail) => {
    const web3 = web3Factory(network)
    web3.eth.net.isListening().then(() => {
      console.log('updateWeb3 network: isListening: ', network)
      dispatch(SessionActions.updateWeb3(web3))
      resolve()
    }).catch((e) => {
      fail(e)
    })
  })
}

export const changeGasSlideValue = (value, blockchain) => (dispatch) =>
  dispatch(SessionActions.gasSliderMultiplierChange(value, blockchain))

export const destroyNetworkSession = (isReset = true) => (dispatch) => {
  if (isReset) {
    // for tests
    web3Provider.beforeReset()
    web3Provider.afterReset()
  }

  dispatch(SessionActions.sessionDestroy())
}

export const createNetworkSession = (account, provider, network) => (dispatch) => {
  if (!account || !provider || !network) {
    throw new Error(`Wrong session arguments: account: ${account}, provider: ${provider}, network: ${network}`)
  }

  dispatch(NetworkActions.networkSetAccounts([account]))
  dispatch(SessionActions.sessionCreate(account))
}

export const logout = () => async (dispatch) => {
  try {
    dispatch(stopMarket(true)) // true means isGraceful disconnect, do not reconnect
    dispatch(cleanWalletsList())
    dispatch(destroyNetworkSession())
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('logout error:', e)
  }
}

export const login = (account) => async (dispatch, getState) => {
  const state = getState()

  const { customNetworksList } = state.get(DUCK_PERSIST_ACCOUNT)
  const { selectedNetworkId, selectedProviderId } = state.get(DUCK_NETWORK)
  if (!state.get(DUCK_SESSION).isSession) {
    // setup and check network first and create session
    throw new Error('Session has not been created')
  }

  console.log('Login check 1: ', account)

  let network = getNetworkById(selectedNetworkId, selectedProviderId)
  if (!network.id) {
    network = customNetworksList.find((network) => network.id === selectedNetworkId)
  }
  console.log('Login check 2: ', account)

  const web3 = typeof window !== 'undefined'
    ? web3Factory(network)
    : null
  console.log('Login check 3: ', account)

  await dispatch(initEthereum({ web3 }))
  console.log('Login check 4: ', account)

  await dispatch(watcher({ web3 }))
  console.log('Login check 5: ', account)

  const userManagerDAO = daoByType('UserManager')(getState())
  const [isCBE, profile] = await Promise.all([
    userManagerDAO.isCBE(account),
    userManagerDAO.getMemberProfile(account, web3),
  ])
  console.log('Login check 6: ', account)

  dispatch(SessionActions.sessionProfile(profile, isCBE))
  const defaultURL = isCBE ? DEFAULT_CBE_URL : DEFAULT_USER_URL
  console.log('Login check 7: ', account)

  return defaultURL
}

export const bootstrap = () => async () => {
  return true //FIXME remove method
}

export const getProfileSignature = (signer, path) => async (dispatch, getState) => {
  if (!signer) {
    return
  }

  try {
    const addresses = getAccountAddresses(getState())
    console.log('addresses: ', addresses)

    if (!Object.keys(addresses).length) {
      throw new Error('Addresses list is empty')
    }
    const signDataString = ProfileService.getSignData(addresses)
    const signData = await signer.signData(signDataString, path)
    const profileSignature = await dispatch(ProfileThunks.getUserProfile(signData.signature, addresses))
    dispatch(SessionActions.setProfileSignature(profileSignature))

    return profileSignature
  } catch (error) {
    // FIXME: to handle it in appropriate way
    // eslint-disable-next-line no-console
    console.warn('getProfileSignature error: ', error)
  }
}

export const updateUserProfile = (profile) => async (dispatch, getState) => {
  const { profileSignature } = getState().get(DUCK_SESSION)
  const newProfile = await dispatch(ProfileThunks.updateUserProfile(profile))

  dispatch(SessionActions.setProfileSignature({
    ...profileSignature,
    profile: newProfile,
  }))
}
