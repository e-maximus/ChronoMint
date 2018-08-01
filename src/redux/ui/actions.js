/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import moment from 'moment'
import { setLocale } from '@chronobank/core-dependencies/i18n'
import ls from '@chronobank/core-dependencies/utils/LocalStorage'
import ipfs from '@chronobank/core-dependencies/utils/IPFS'
import { notify } from '@chronobank/core/redux/notifier/actions'
import userMonitorService from 'user/monitorService'
import { TX_FRONTEND_ERROR_CODES } from '@chronobank/core/dao/constants'
import { modalsOpen } from 'redux/modals/actions'
import { DUCK_WATCHER, WATCHER_TX_SET, WATCHER_TX_END } from '@chronobank/core/redux/watcher/constants'
import AbstractContractDAO from '@chronobank/core/refactor/daos/lib/AbstractContractDAO'
import TxError from '@chronobank/core/models/TxError'
import ConfirmTxDialog from 'components/dialogs/ConfirmTxDialog/ConfirmTxDialog'
import UserActiveDialog from 'components/dialogs/UserActiveDialog/UserActiveDialog'
import TransactionErrorNoticeModel from '@chronobank/core/models/notices/TransactionErrorNoticeModel'
import { CHANGE_WALLET_VIEW } from './reducer'
import ConfirmTransferDialog from '../../components/dialogs/ConfirmTransferDialog/ConfirmTransferDialog'

export const txHandlingFlow = () => (dispatch) => {
  AbstractContractDAO.txStart = async (tx, estimateGas, localFeeMultiplier) => {
    dispatch({ type: WATCHER_TX_SET, tx })

    const { isConfirmed, updatedTx } = await dispatch(showConfirmTxModal(estimateGas, localFeeMultiplier))
    if (!isConfirmed) {
      throw new TxError('Cancelled by user from custom tx confirmation modal', TX_FRONTEND_ERROR_CODES.FRONTEND_CANCELLED)
    }

    // uncomment code below if you want to simulate prolongation of tx mining
    // const sleep = (seconds) => {
    //   return new Promise(resolve => {
    //     setTimeout(() => {
    //       resolve()
    //     }, seconds * 1000)
    //   })
    // }
    // const seconds = 10
    // console.warn('Simulated ' + seconds + ' seconds prolongation of tx mining')
    // await sleep(seconds)
    return updatedTx
  }

  AbstractContractDAO.txGas = (tx) => {
    dispatch({ type: WATCHER_TX_SET, tx })
  }

  AbstractContractDAO.txEnd = (tx, e: ?TxError = null) => {
    dispatch({ type: WATCHER_TX_END, tx })

    if (e && e.codeValue !== TX_FRONTEND_ERROR_CODES.FRONTEND_CANCELLED) {
      dispatch(notify(new TransactionErrorNoticeModel(tx, e)))
    }
  }
}

export const removeWatchersUserMonitor = () => () => {
  userMonitorService
    .removeAllListeners('active')
    .stop()
}

export const watchInitUserMonitor = () => (dispatch) => {
  userMonitorService
    .on('active', () => dispatch(modalsOpen({ component: UserActiveDialog })))
    .start()
}

export const showConfirmTransferModal = (dao, tx) => (dispatch) => {
  dispatch(modalsOpen({
    component: ConfirmTransferDialog,
    props: {
      tx,
      dao,
      confirm: (tx) => dao.accept(tx),
      reject: (tx) => dao.reject(tx),
    },
  }))
}

// TODO @ipavlenko: Do not use promise, use emitter, see showConfirmTransferModal
export const showConfirmTxModal = (estimateGas, localFeeMultiplier) => (dispatch, getState) => new Promise((resolve) => {
  dispatch(modalsOpen({
    component: ConfirmTxDialog,
    props: {
      callback: (isConfirmed, tx) => resolve({ isConfirmed, updatedTx: tx }),
      localFeeMultiplier,
      handleEstimateGas: async (func, args, value, gasPriceMultiplier = 1) => {
        if (!estimateGas) {
          return
        }
        const { gasFee, gasLimit, gasPrice } = await estimateGas(func, args, value)
        let tx = getState().get(DUCK_WATCHER).confirmTx
        tx = tx
          .gasPrice(gasPrice.mul(gasPriceMultiplier))
          .setGas(gasFee.mul(gasPriceMultiplier))
          .gasLimit(gasLimit)
        dispatch({ type: WATCHER_TX_SET, tx })
      },
    },
  }))
}).catch((e) => {
  // eslint-disable-next-line
  console.error('Confirm modal error:', e)
  return { isConfirmed: false }
})

export const changeMomentLocale = (locale) => (dispatch) => {
  moment.locale(locale)
  ls.setLocale(locale)
  dispatch(setLocale(locale))
}

export const download = (hash, name) => async () => {
  // do nt limit a time to download
  const data = await ipfs.get(hash, 100000)
  const ref = document.createElement('a')
  ref.href = data.content
  if (name) {
    ref.download = name
  }
  document.body.appendChild(ref)
  ref.click()
  document.body.removeChild(ref)
}

export const changeWalletView = () => (dispatch) => {
  dispatch({ type: CHANGE_WALLET_VIEW })
}
