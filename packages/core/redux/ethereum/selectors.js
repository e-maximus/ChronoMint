import { createSelector } from 'reselect'
import { TxExecModel, WalletModel, MultisigEthWalletModel } from '../../models'
import { getWallet } from '../wallets/selectors/models'
import { getMainSymbolForBlockchain } from '../tokens/selectors'
import { DUCK_ETHEREUM } from './constants'

export const ethereumSelector = () => (state) => state.get(DUCK_ETHEREUM)

export const web3Selector = () => createSelector(
  ethereumSelector(),
  (ethereum) => {
    return ethereum == null // nil check
      ? null
      : ethereum.web3.value
  },
)

export const pendingSelector = () => createSelector(
  ethereumSelector(),
  (ethereum) => ethereum == null // nil check
    ? null
    : ethereum.pending,
)

export const pendingEntrySelector = (address, key) => createSelector(
  pendingSelector(),
  (pending) => {
    if (address in pending) {
      const res = pending[address][key] || null
      if (!res) {
        console.log('res null', address, key, pending, new Error())
      }
      return res
    }
    console.log('res null', address, key, pending, new Error())
    return null
  },
)

export const getDataForConfirm = (tx: TxExecModel) => createSelector(
  [
    getWallet(`${tx.blockchain}-${tx.from}`),
  ],
  (wallet: WalletModel | MultisigEthWalletModel) => {
    let amountBalanceAfter = null
    let feeBalanceAfter = null

    const mainSymbol = getMainSymbolForBlockchain(tx.blockchain)
    const balances = wallet.balances
    const amountBalance = balances[tx.symbol]
    const feeBalance = balances[mainSymbol]
    if (tx.fields && tx.fields.amount) {
      amountBalanceAfter = tx.fields.amount && tx.fields.amount.mark === 'plus' ?
        amountBalance.plus(tx.fields.amount.value) :
        amountBalance.minus(tx.fields.amount.value)
    }

    const gasFee = tx.gasPrice.mul(tx.gasLimit)
    if (mainSymbol === tx.symbol) {
      feeBalanceAfter = amountBalanceAfter = amountBalanceAfter.minus(gasFee)
    } else {
      feeBalanceAfter = feeBalance.minus(gasFee)
    }

    return {
      fields: tx.fields,
      mainSymbol,
      amountBalanceAfter,
      feeBalanceAfter,
    }
  }
  ,
)