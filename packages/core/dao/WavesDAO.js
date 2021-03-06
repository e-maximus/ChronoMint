/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import EventEmitter from 'events'
import TokenModel from '../models/tokens/TokenModel'
import TxModel from '../models/TxModel'
import Amount from '../models/Amount'
import { wavesAddress } from '../models/validator'

import {
  EVENT_NEW_TRANSFER,
  EVENT_UPDATE_BALANCE,
} from './constants'
import TxDescModel from '../models/TxDescModel'

export const BLOCKCHAIN_WAVES = 'WAVES'
export const WAVES_WAVES_SYMBOL = 'WAVES'
export const WAVES_WAVES_NAME = 'WAVES'
export const WAVES_DECIMALS = 8

const EVENT_TX = 'tx'
const EVENT_BALANCE = 'balance'

export default class WavesDAO extends EventEmitter {

  constructor (name, symbol, wavesProvider, decimals, asset, wavesToken) {
    super()
    this._name = name
    this._symbol = symbol
    this._decimals = decimals
    this._asset = asset
    this._wavesProvider = wavesProvider
    this._wavesToken = wavesToken
  }

  getAddressValidator () {
    return wavesAddress
  }

  getAccount () {
    return this._wavesProvider.getAddress()
  }

  getInitAddress () {
    // WavesDAO is not a contract DAO, WAVES have no initial address, but it have a token name.
    return `Waves/${this._asset}/${this._symbol}`
  }

  getName () {
    return this._name
  }

  getSymbol () {
    return this._symbol
  }

  isApproveRequired () {
    return false
  }

  isInitialized () {
    return this._wavesProvider.isInitialized()
  }

  getDecimals () {
    return this._decimals
  }

  getAccountBalances () {
    return this._wavesProvider.getAccountBalances(this._name)
  }

  getAccountBalance () {
    return this.getAccountBalances()
  }

  transfer (from: string, to: string, amount: BigNumber) {
    return {
      from,
      to,
      value: new BigNumber(amount),
    }
  }

  // TODO @ipavlenko: Rename to 'transfer' after all token DAOs will start using 'submit' method and 'trans'
  async immediateTransfer (from: string, to: string, amount: BigNumber /*token: TokenModel, feeMultiplier: number = 1*/) {
    try {
      return await this._wavesProvider.transfer(from, to, amount, this._asset)
    } catch (e) {
      // eslint-disable-next-line
      throw e
    }
  }

  async getTransfer (id, account, skip, offset): Promise<Array<TxDescModel>> {
    const txs = []
    try {
      const txsResult = await this._wavesProvider.getTransactionsList(account, id, skip, offset)
      for (const tx of txsResult) {
        if (tx.value > 0) {
          txs.push(
            new TxDescModel({
              confirmations: tx.confirmations,
              title: tx.details ? tx.details.event : 'tx.transfer',
              hash: tx.txHash,
              time: tx.time,
              blockchain: this._name,
              blockNumber: tx.blockNumber,
              address: tx.details ? tx.details.address : null,
              value: new Amount(tx.value, tx.symbol || this._symbol),
              fee: new Amount(tx.fee, this._symbol),
              from: tx.from,
              to: tx.to,
              params: [
                {
                  name: 'from',
                  value: tx.from,
                },
                {
                  name: 'to',
                  value: tx.to,
                },
                {
                  name: 'amount',
                  value: new Amount(tx.value, tx.symbol || this._symbol),
                },
              ],
            }))
        }
      }
    } catch (e) {
      // eslint-disable-next-line
      console.warn('WavesDAO getTransfer', e)
    }
    return txs
  }

  watch (/*account*/): Promise {
    return Promise.all([
      this.watchTransfer(),
      this.watchBalance(),
    ])
  }

  async watchTransfer () {
    this._wavesProvider.addListener(EVENT_TX, async ({ tx }) => {
      if (tx.unconfirmed) {
        if (!this._asset) {
          if (!tx.assets) {
            this.emit(EVENT_NEW_TRANSFER, this._createWavesTxModel(tx))
          }
        } else {
          if (tx.assets && (this._asset in tx.assets)) {
            this.emit(EVENT_NEW_TRANSFER, this._createAssetTxModel(tx))
          }
        }
      }
    })
  }

  _createWavesTxModel (tx) {
    return new TxModel({
      txHash: tx.txHash,
      blockNumber: null,
      time: tx.time,
      from: tx.from || tx.signer,
      to: tx.to,
      value: new Amount(tx.value, this._symbol),
      fee: new Amount(tx.fee, this._symbol),
      blockchain: BLOCKCHAIN_WAVES,
    })
  }

  _createAssetTxModel (tx) {
    return new TxModel({
      txHash: tx.txHash,
      blockNumber: null,
      time: tx.time,
      from: tx.from || tx.signer,
      to: tx.to,
      value: new Amount(tx.assets[this._assetId], this._symbol),
      fee: new Amount(tx.fee, WAVES_WAVES_SYMBOL),
      blockchain: BLOCKCHAIN_WAVES,
    })
  }

  async watchBalance () {
    this._wavesProvider.addListener(EVENT_BALANCE, async ({ account, time, balance }) => {
      this.emit(EVENT_UPDATE_BALANCE, {
        account,
        time,
        balance: readBalanceValue(this._symbol, balance),
      })
    })
  }

  async fetchToken () {
    if (!this.isInitialized()) {
      const message = `${this._symbol} support is not available`
      // eslint-disable-next-line
      console.warn(message)
      throw new Error(message)
    }
    const token = new TokenModel({
      name: this._name,
      decimals: this._decimals,
      symbol: this._symbol,
      isOptional: false,
      isFetched: true,
      blockchain: BLOCKCHAIN_WAVES,
    })
    return token
  }
}

//TODO WHY WE NEED SYMBOL AND ASSET DESCRIPTION IF SYMBOL IS ENOUGH
function readBalanceValue (symbol, balance /*asset = null*/) {
  // @todo assets
  // console.log('readBalanceValue: ', symbol, balance, asset)
  // if (asset) {
  //   return balance.assets[asset]
  // }
  return balance.balance
}
