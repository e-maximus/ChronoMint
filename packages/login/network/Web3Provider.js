/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import promisify from 'promisify-node-callback'
import MonitorService from './MonitorService'

const ERROR_WEB3_UNDEFINED = 'Web3 is undefined. Please use setWeb3() first.'

/**
 * will be injected to class on set web3
 * @see Web3Provider.setWeb3
 */
const promisifyFunctions = [
  'getBlock',
  'getBlockNumber',
  'getAccounts',
  'getBalance',
  'sendTransaction',
  'getTransaction',
  'getTransactionReceipt',
  'getCode',
  'getGasPrice',
  'estimateGas',
]

export class Web3Provider {

  _web3Promise = null
  _web3instance = null
  _resolveCallback = null
  _resetCallbacks = []
  _permanentResetCallbacks = []

  constructor (web3Instance = null, withMonitor = false) {
    if (web3Instance) {
      this.setWeb3(web3Instance)
    }
    this._web3Promise = this._getWeb3Promise()
    // for redux-devtool
    Object.defineProperty(this, '_web3instance', {
      enumerable: false,
    })
    if (withMonitor) {
      // Just a plugin to Web3Provider
      this._monitorService = new MonitorService(this)
    }
  }

  resolve () {
    return this._resolveCallback()
  }

  getWeb3 () {
    return this._web3Promise
  }

  getWeb3instance () {
    if (!this._web3instance) {
      throw new Error(ERROR_WEB3_UNDEFINED)
    }
    return this._web3instance
  }

  getMonitorService () {
    return this._monitorService
  }

  reinit (Web3ClassOrInstance, provider) {
    this.beforeReset()
    this.setWeb3(Web3ClassOrInstance)
    this.setProvider(provider)
    this.afterReset()
  }

  pushWallet (idx) {
    this._provider.pushWallet(idx)
    const web3 = this._web3instance
    web3.setProvider(this._provider)
  }

  setWeb3 (Web3ClassOrInstance) {
    typeof Web3ClassOrInstance === 'function'
      ? this._web3instance = new Web3ClassOrInstance()
      : this._web3instance = Web3ClassOrInstance

    const web3 = this._web3instance
    promisifyFunctions.forEach((func) => {
      this[func] = promisify(web3.eth[func])
    })
    // hack due to web3.isConnected is in sync mode only
    this.isConnected = web3.isConnected//promisify(web3.net.getListening)
  }

  _getWeb3Promise () {
    return new Promise((resolve) => {
      this._resolveCallback = () => {
        // for debug
        window.web3instance = this._web3instance
        resolve(this._web3instance)
      }
    })
  }

  setProvider (provider) {
    const web3 = this._web3instance
    if (!web3) {
      throw new Error(ERROR_WEB3_UNDEFINED)
    }
    this._provider = provider
    web3.setProvider(provider)
    if (this._monitorService) {
      this._monitorService.sync()
    }
  }

  // TODO @ipavlenko: Please use cancellable subscriptions, possible memory leak
  onReset (callback) {
    this._resetCallbacks.push(callback)
  }

  onResetPermanent (callback) {
    this._permanentResetCallbacks.push(callback)
  }

  beforeReset () {
    if (this._monitorService) {
      this._monitorService.reset()
    }
    // reset filters
    if (this._web3instance) {
      //this._web3instance.reset(false)
    }

    // create new instance
    this._web3instance = null
    this._web3Promise = this._getWeb3Promise()

    // stop block polling testrpc provider didnt have stop method
    if (this._provider && this._provider.stop) {
      this._provider.stop()
    }
  }

  afterReset () {
    this._permanentResetCallbacks.forEach((callback) => callback())
    this._resetCallbacks.forEach((callback) => callback())
    this._resetCallbacks = []
  }
}

/*declare type Web3Provider = {
  ...Web3Provider,
  getBlock: Function,
  getBlockNumber: Function,
  getAccounts: Function,
  getBalance: Function,
  sendTransaction: Function,
  getTransaction: Function,
  getTransactionReceipt: Function,
  getCode: Function,
  getGasPrice: Function,
  estimateGas: Function,
}*/

export default new Web3Provider(null, true)
