/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import AbstractProvider from './AbstractProvider'
import { WavesBalance, WavesTx } from './WavesAbstractNode'
import { selectWavesNode } from './WavesNode'

export class WavesProvider extends AbstractProvider {
  constructor () {
    super(...arguments)
    this._handleTransaction = (tx) => this.onTransaction(tx)
    this._handleBalance = (balance) => this.onBalance(balance)
    this._id = 'WAVES'
  }

  subscribe (address) {
    const node = super.subscribe(address)
    node.addListener('tx', this._handleTransaction)
    node.addListener('balance', this._handleBalance)
  }

  unsubscribe (address) {
    const node = super.unsubscribe(address)
    node.removeListener('tx', this._handleTransaction)
    node.removeListener('balance', this._handleBalance)
  }

  async getTransactionInfo (transactionId) {
    const node = this._selectNode(this.networkSettings)
    return node.getTransactionInfo(transactionId)
  }

  async getAssets (/*address*/) {
    // @todo
    return {}
    // const node = this._selectNode(this.networkSettings)
    // const { assets } = await node.getAddressInfo(address)
    // return { ...assets }
  }

  async getAccountBalances (address) {
    const node = this._selectNode(this.networkSettings)
    const { balance, assets } = await node.getAddressInfo(address)
    if (Object.keys(assets).length && assets[address]) {
      return new BigNumber(assets[address]['balance'])
    }
    return new BigNumber(balance)
  }

  async getTransactionsList (address, id, skip, offset) {
    const node = this._selectNode(this.networkSettings)
    return node.getTransactionsList(address, id, skip, offset)
  }

  justTransfer (from, signedTx) {
    const node = this._selectNode(this.networkSettings)
    return node.send(from, signedTx)
  }

  async onTransaction (tx: WavesTx, address) {
    this.emit('tx', {
      account: address,
      time: new Date().getTime(),
      tx,
    })
  }

  async onBalance (balance: WavesBalance) {
    this.emit('balance', {
      account: balance.address,
      time: new Date().getTime(),
      balance,
    })
  }
}

export const wavesProvider = new WavesProvider(selectWavesNode)
