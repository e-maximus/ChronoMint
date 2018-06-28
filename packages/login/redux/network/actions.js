/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import {
  createAccount,
  resetPasswordAccount,
  validateMnemonicForAccount,
  validateAccountName,
  decryptAccount,
  accountAdd,
  accountSelect,
} from '@chronobank/core/redux/persistAccount/actions'
import {
  FORM_CONFIRM_MNEMONIC,
  FORM_MNEMONIC_LOGIN_PAGE,
  FORM_PRIVATE_KEY_LOGIN_PAGE,
  FORM_LOGIN_PAGE,
  FORM_CREATE_ACCOUNT,
  FORM_RECOVER_ACCOUNT,
  FORM_RESET_PASSWORD,
  FORM_WALLET_UPLOAD,
} from '@chronobank/login-ui/components'
import Web3 from 'web3'
import bip39 from 'bip39'
import Accounts from 'web3-eth-accounts'
import { login } from '@chronobank/core/redux/session/actions'
import { stopSubmit, SubmissionError } from 'redux-form'
import { push } from 'react-router-redux'
import networkService from '@chronobank/login/network/NetworkService'
import privateKeyProvider from '@chronobank/login/network/privateKeyProvider'
import mnemonicProvider from '@chronobank/login/network/mnemonicProvider'
import { ethereumProvider } from '../../network/EthereumProvider'
import { btcProvider, ltcProvider, btgProvider } from '../../network/BitcoinProvider'
import { nemProvider } from '../../network/NemProvider'

export const DUCK_NETWORK = 'network'

export const NETWORK_LOADING = 'network/LOADING'
export const NETWORK_SET_ACCOUNTS = 'network/SET_ACCOUNTS'
export const NETWORK_SELECT_ACCOUNT = 'network/SELECT_ACCOUNT'
export const NETWORK_ADD_ERROR = 'network/ADD_ERROR'
export const NETWORK_CLEAR_ERRORS = 'network/CLEAR_ERRORS'
export const NETWORK_SET_TEST_MNEMONIC = 'network/SET_TEST_MNEMONIC'
export const NETWORK_SET_TEST_WALLET_FILE = 'network/SET_TEST_WALLET_FILE'
export const NETWORK_SET_TEST_RPC = 'network/SET_TEST_RPC'
export const NETWORK_SET_TEST_METAMASK = 'network/SET_TEST_METAMASK'
export const NETWORK_SET_NETWORK = 'network/SET_NETWORK'
export const NETWORK_SET_PROVIDER = 'network/SET_PROVIDER'
export const NETWORK_SET_NEW_ACCOUNT_CREDENTIALS = 'network/SET_NEW_ACCOUNT_CREDENTIALS'
export const NETWORK_SET_NEW_MNEMONIC = 'network/SET_NEW_MNEMONIC'
export const NETWORK_RESET_NEW_MNEMONIC = 'network/RESET_NEW_MNEMONIC'

export const NETWORK_SET_IMPORT_MNEMONIC = 'network/SET_IMPORT_MNEMONIC'
export const NETWORK_SET_IMPORT_PRIVATE_KEY = 'network/SET_NEW_PRIVATE_KEY'
export const NETWORK_RESET_IMPORT_PRIVATE_KEY = 'network/RESET_NEW_PRIVATE_KEY'
export const NETWORK_SET_IMPORT_ACCOUNT_MODE = 'network/SET_IMPORT_ACCOUNT_MODE'
export const NETWORK_RESET_IMPORT_ACCOUNT_MODE = 'network/RESET_IMPORT_ACCOUNT_MODE'
export const NETWORK_SET_LOGIN_SUBMITTING = 'network/SET_LOGIN_SUBMITTING'
export const NETWORK_RESET_LOGIN_SUBMITTING = 'network/RESET_LOGIN_SUBMITTING'
export const NETWORK_SET_ACCOUNT_RECOVERY_MODE = 'network/SET_ACCOUNT_RECOVERY_MODE'
export const NETWORK_RESET_ACCOUNT_RECOVERY_MODE = 'network/RESET_ACCOUNT_RECOVERY_MODE'

export const WALLETS_ADD = 'network/WALLETS_ADD'
export const WALLETS_SELECT = 'network/WALLETS_SELECT'
export const WALLETS_LOAD = 'network/WALLETS_LOAD'
export const WALLETS_UPDATE_LIST = 'network/WALLETS_UPDATE_LIST'
export const WALLETS_REMOVE = 'network/WALLETS_REMOVE'

export const loading = (isLoading = true) => (dispatch) => {
  dispatch({ type: NETWORK_LOADING, isLoading })
}

export const addError = (error) => (dispatch) => {
  dispatch({ type: NETWORK_ADD_ERROR, error })
}

export const clearErrors = () => (dispatch) => {
  dispatch({ type: NETWORK_CLEAR_ERRORS })
}

export const navigateToCreateAccountWithoutImport = () => (dispatch) => {
  dispatch(navigateToCreateAccount())
  dispatch({ type: NETWORK_RESET_IMPORT_ACCOUNT_MODE })
}

export const initConfirmMnemonicPage = () => (dispatch, getState) => {
  const state = getState()

  const { newAccountMnemonic } = state.get('network')

  if (!newAccountMnemonic){
    dispatch(navigateToCreateAccount())
  }

}

export const initMnemonicPage = () => (dispatch, getState) => {
  const state = getState()

  const { newAccountName, newAccountPassword } = state.get('network')

  const emptyAccountCredentials = !newAccountName || !newAccountPassword

  if (emptyAccountCredentials){
    dispatch(navigateToCreateAccount())
  }
}

export const initLoginPage = () => (dispatch, getState) => {
  const state = getState()

  const { selectedWallet } = state.get('persistAccount')

  dispatch({ type: NETWORK_RESET_LOGIN_SUBMITTING })

  if (!selectedWallet){
    dispatch(navigateToSelectWallet())
  }

}

export const resetNewMnemonic = () => (dispatch) => {
  dispatch({ type: NETWORK_RESET_NEW_MNEMONIC })
}
export const generateNewMnemonic = () => (dispatch) => {
  const mnemonic = mnemonicProvider.generateMnemonic()

  dispatch({ type: NETWORK_SET_NEW_MNEMONIC, mnemonic })
}

export const resetImportAccountMode = () => (dispatch) => {
  dispatch({ type: NETWORK_RESET_IMPORT_ACCOUNT_MODE })
}

export const onSubmitCreateAccountPage = (walletName, walletPassword) => async (dispatch, getState) => {
  const state = getState()

  const { importAccountMode, newAccountMnemonic, newAccountPrivateKey } = state.get('network')

  const validateName = dispatch(validateAccountName(walletName))

  if (!validateName){
    throw new SubmissionError({ walletName: 'Wrong wallet name' })
  }

  dispatch({ type: NETWORK_SET_NEW_ACCOUNT_CREDENTIALS,  walletName, walletPassword })

  if (importAccountMode){
    try {
      let wallet = await dispatch (createAccount ({
        name: walletName,
        password: walletPassword,
        mnemonic: newAccountMnemonic,
        privateKey: newAccountPrivateKey,
        numberOfAccounts: 0,
      }))

      dispatch (accountAdd (wallet))

      dispatch (accountSelect (wallet))

      dispatch (resetImportAccountMode ())

      dispatch (navigateToLoginPage ())
    } catch(e){
      throw new SubmissionError({ _error: e && e.message })
    }

    return
  }

  dispatch(generateNewMnemonic())

  dispatch(navigateToGenerateMnemonicPage())

}

export const onSubmitCreateAccountPageSuccess = () => (dispatch) => {

}

export const onSubmitCreateAccountPageFail = (errors, dispatch, submitErrors) => (dispatch) => {
  dispatch(stopSubmit(FORM_CREATE_ACCOUNT, submitErrors && submitErrors.errors))
}

export const initImportMethodsPage = () => (dispatch) => {
  dispatch({ type: NETWORK_SET_IMPORT_ACCOUNT_MODE })
}

export const onSubmitConfirmMnemonic = (confirmMnemonic) => (dispatch, getState) => {
  const state = getState()

  const { newAccountMnemonic } = state.get('network')

  if (confirmMnemonic !== newAccountMnemonic){
    throw new SubmissionError({ _error: 'Please enter correct mnemonic phrase'  })
  }

}

export const onSubmitConfirmMnemonicSuccess = () => async (dispatch, getState) => {
  const state = getState()

  const { newAccountMnemonic, newAccountName, newAccountPassword } = state.get('network')

  let wallet = await dispatch(createAccount({
    name: newAccountName,
    password: newAccountPassword,
    mnemonic: newAccountMnemonic,
    numberOfAccounts: 0,
  }))

  dispatch(accountAdd(wallet))

  dispatch(accountSelect(wallet))

  dispatch(navigateToDownloadWalletPage())
}

export const onSubmitConfirmMnemonicFail = (errors, dispatch, submitErrors) => (dispatch) => {
  dispatch(stopSubmit(FORM_CONFIRM_MNEMONIC, submitErrors && submitErrors.errors))
}

export const navigateToConfirmMnemonicPage = () => (dispatch) => {
  dispatch(push('/login/confirm-mnemonic'))
}

export const navigateToDownloadWalletPage = () => (dispatch) => {
  dispatch(push('/login/download-wallet'))
}

export const navigateToCreateAccount = () => (dispatch) => {
  dispatch(push('/login/create-account'))
}

export const navigateToSelectImportMethod = () => (dispatch) => {
  dispatch(push('/login/import-methods'))
}

export const navigateToMnemonicImportMethod = () => (dispatch) => {
  dispatch(push('/login/mnemonic-login'))
}

export const navigateToPrivateKeyImportMethod = () => (dispatch) => {
  dispatch(push('/login/private-key-login'))
}

export const navigateToSelectWallet = () => (dispatch) => {
  dispatch(push('/login/select-account'))
}

export const navigateToLoginPage = () => (dispatch) => {
  dispatch(push('/login'))
}

export const navigateToResetPasswordPage = () => (dispatch) => {
  dispatch(push('/login/reset-password'))
}

export const navigateToRecoverAccountPage = () => (dispatch) => {
  dispatch(push('/login/recover-account'))
}

export const navigateToGenerateMnemonicPage = () => (dispatch) => {
  dispatch(push('/login/mnemonic'))
}

export const navigateToWalletUploadMethod = () => (dispatch) => {
  dispatch(push('/login/upload-wallet'))
}

export const onSubmitMnemonicLoginForm = (mnemonic) => async (dispatch) => {
  if (!bip39.validateMnemonic(mnemonic)){
    throw new Error('Invalid mnemonic')
  }

  dispatch({ type: NETWORK_SET_NEW_MNEMONIC, mnemonic })

}

export const onSubmitMnemonicLoginFormSuccess = () => (dispatch) => {
  dispatch(navigateToCreateAccount())
}

export const onSubmitMnemonicLoginFormFail = () => (dispatch) => {
  dispatch(stopSubmit(FORM_MNEMONIC_LOGIN_PAGE, { key: 'Wrong mnemonic' }))

}

export const onSubmitPrivateKeyLoginForm = (privateKey) => (dispatch) => {
  let pk = privateKey || ''

  if (pk.slice(0, 2) === '0x'){
    pk = pk.slice(2)
  }

  dispatch({ type: NETWORK_SET_IMPORT_PRIVATE_KEY, privateKey: pk })
}

export const onSubmitPrivateKeyLoginFormSuccess = () => (dispatch) => {
  dispatch(navigateToCreateAccount())
}

export const onSubmitPrivateKeyLoginFormFail = () => (dispatch) => {
  dispatch(stopSubmit(FORM_PRIVATE_KEY_LOGIN_PAGE, { pk: 'Wrong private key' }))

}

export const onSubmitLoginForm = (password) => async (dispatch, getState) => {
  const state = getState()

  dispatch({ type: NETWORK_SET_LOGIN_SUBMITTING })

  const { selectedWallet } = state.get('persistAccount')

  try {
    let wallet = await dispatch (decryptAccount (selectedWallet, password))

    let privateKey = wallet && wallet[0] && wallet[0].privateKey

    if (privateKey) {
      await dispatch(handlePrivateKeyLogin(privateKey))
    }

  } catch(e){
    console.log('onSubmit', e)
    console.dir(e)
    throw new SubmissionError({ password: e && e.message })
  }
}

export const onSubmitLoginFormSuccess = () => () => {
}

export const onSubmitLoginFormFail = (errors, dispatch, submitErrors) => (dispatch) => {
  dispatch(stopSubmit(FORM_LOGIN_PAGE, submitErrors && submitErrors.errors ))
  dispatch({ type: NETWORK_RESET_LOGIN_SUBMITTING })

}

export const validateRecoveryForm = (mnemonic) => (dispatch, getState) => {
  const state = getState()

  const { selectedWallet } = state.get('persistAccount')

  return dispatch(validateMnemonicForAccount(selectedWallet, mnemonic))

}

export const initRecoverAccountPage = () => (dispatch) => {
  dispatch(resetNewMnemonic())
  dispatch({ type: NETWORK_SET_ACCOUNT_RECOVERY_MODE })
}

export const onSubmitRecoverAccountForm = (mnemonic) => (dispatch) => {
  const validForm = dispatch(validateRecoveryForm(mnemonic))

  if (!validForm) {
    throw new SubmissionError({ _error: 'Mnemonic incorrect for this wallet' })
  }

  dispatch({ type: NETWORK_SET_NEW_MNEMONIC, mnemonic })
}

export const onSubmitRecoverAccountFormSuccess = () => (dispatch) => {
  dispatch(navigateToResetPasswordPage())
}

export const onSubmitRecoverAccountFormFail = () => (dispatch) => {
  dispatch(stopSubmit(FORM_RECOVER_ACCOUNT, { pk: 'Wrong private key' }))

}

export const initResetPasswordPage = () => (dispatch, getState) => {
  const state = getState()

  const { accountRecoveryMode } = state.get('network')

  if (!accountRecoveryMode){
    dispatch(navigateToRecoverAccountPage())
  }
}

export const onSubmitResetAccountPasswordForm = (password) => async (dispatch, getState) => {
  const state = getState()

  const { newAccountMnemonic } = state.get('network')
  const { selectedWallet } = state.get('persistAccount')

  await dispatch(resetPasswordAccount(selectedWallet, newAccountMnemonic, password))

}

export const onSubmitResetAccountPasswordSuccess = () => (dispatch) => {
  dispatch({ type: NETWORK_RESET_ACCOUNT_RECOVERY_MODE })
  dispatch(navigateToLoginPage())

}

export const onSubmitResetAccountPasswordFail = (error, dispatch, submitError) => (dispatch) => {
  dispatch(stopSubmit(FORM_RESET_PASSWORD, { _error: 'Error' }))

}

export const onSubmitWalletUpload = (walletString, password) => async (dispatch, getState) => {
  const state = getState()

  const { selectedWallet } = state.get('persistAccount')

  try {
    let restoredWalletJSON = JSON.parse(walletString)

    if ('Crypto' in restoredWalletJSON){
      restoredWalletJSON.crypto = restoredWalletJSON.Crypto
      delete restoredWalletJSON.Crypto
    }

    console.log ('restoredWalletJSON', restoredWalletJSON)
    let wallet = await dispatch (decryptAccount([restoredWalletJSON], password))

    let privateKey = wallet && wallet[0] && wallet[0].privateKey

    let pk = privateKey || ''

    if (pk.slice(0, 2) === '0x'){
      pk = pk.slice(2)
    }

    console.log ('restoredWalletJSON private key', privateKey)

    dispatch ({ type: NETWORK_SET_IMPORT_PRIVATE_KEY, privateKey: pk })
  } catch(e){
    console.log('throw', e)
    console.dir(e)
    throw new SubmissionError({ _error: e && e.message })
  }

}

export const onSubmitWalletUploadSuccess = () => (dispatch) => {
  dispatch(navigateToCreateAccount())

}

export const onSubmitWalletUploadFail = (error, dispatch, submitError) => (dispatch) => {
  dispatch(stopSubmit(FORM_WALLET_UPLOAD, submitError && submitError.errors))

}

export const onWalletSelect = (wallet) => (dispatch) => {
  dispatch(accountSelect(wallet))

  dispatch(navigateToLoginPage())
}

export const handlePrivateKeyLogin = (privateKey) => async (dispatch, getState) => {
  let state = getState()

  dispatch(loading())
  dispatch(clearErrors())
  const provider = privateKeyProvider.getPrivateKeyProvider(privateKey.slice(2), networkService.getProviderSettings(), state.get('multisigWallet'))

  networkService.selectAccount(provider.ethereum.getAddress())
  await networkService.setup(provider)

  state = getState()
  const { selectedAccount, selectedProviderId, selectedNetworkId } = state.get(DUCK_NETWORK)

  dispatch(clearErrors())

  const isPassed = await networkService.checkNetwork(
    selectedAccount,
    selectedProviderId,
    selectedNetworkId,
  )

  if (isPassed) {
    networkService.createNetworkSession(
      selectedAccount,
      selectedProviderId,
      selectedNetworkId,
    )
    dispatch(login(selectedAccount))
  }

}

export const handleMnemonicLogin = (mnemonic) => async (dispatch, getState) => {
  const web3 = new Web3()
  const accounts = new Accounts(new web3.providers.HttpProvider(networkService.getProviderSettings().url))
  await accounts.wallet.clear()

  dispatch(loading())
  dispatch(clearErrors())
  const provider = mnemonicProvider.getMnemonicProvider(mnemonic, networkService.getProviderSettings())
  networkService.selectAccount(provider.ethereum.getAddress())
  await networkService.setup(provider)

  const state = getState()

  const { selectedAccount, selectedProviderId, selectedNetworkId } = state.get(DUCK_NETWORK)

  dispatch(clearErrors())

  const isPassed = await networkService.checkNetwork(
    selectedAccount,
    selectedProviderId,
    selectedNetworkId,
  )

  if (isPassed) {
    networkService.createNetworkSession(
      selectedAccount,
      selectedProviderId,
      selectedNetworkId,
    )
    dispatch(login(selectedAccount))
  }

}

export const getPrivateKeyFromBlockchain = (blockchain: string) => {
  switch (blockchain) {
    case 'Ethereum':
      return ethereumProvider.getPrivateKey()
    case 'Bitcoin':
      return btcProvider.getPrivateKey()
    case 'Bitcoin Gold':
      return btgProvider.getPrivateKey()
    case 'Litecoin':
      return ltcProvider.getPrivateKey()
    case 'NEM':
      return nemProvider.getPrivateKey()
    default:
      return null
  }
}
