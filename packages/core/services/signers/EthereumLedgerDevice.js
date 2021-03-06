/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import EventEmitter from 'events'
import EthereumTx from 'ethereumjs-tx'
import AsyncLock from 'async-lock'
import { omitBy, isNil } from 'lodash'
import Web3Utils from 'web3-utils'
import TransportU2F from '@ledgerhq/hw-transport-u2f'
import AppEth from '@ledgerhq/hw-app-eth'

const DEFAULT_PATH = "44'/60'/0'/0"
const DEFAULT_PATH_FACTORY = (index) => `${DEFAULT_PATH}/${index}`

const LOCK = 'LedgerDevice'

const rejectOnTimeout = (timeout) =>
  new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error('Timeout')), timeout)
  })

export default class EthereumLedgerDevice extends EventEmitter {
  constructor () {
    super()
    this.lock = new AsyncLock({ domainReentrant: true })
  }

  get name () {
    return 'ledger'
  }

  get title () {
    return 'Ledger Device'
  }

  async getAddressInfoList (from: number = 0, limit: number = 5): String {
    return this._safeExec(async () => {
      const addresses = []
      for (let i = from; i < from + limit; i++) {
        const path = DEFAULT_PATH_FACTORY(i)
        const transport = await TransportU2F.create()
        const app = new AppEth(transport)
        const { address, publicKey } = await Promise.race([this._getAddressInfo(app, path), rejectOnTimeout(2000)])
        addresses.push({
          path,
          address,
          publicKey,
          type: this.name,
        })
      }
      return addresses
    })
  }

  async getAddress (path) {
    return this._safeExec(async () => {
      const transport = await TransportU2F.create()
      const appEthereum = new AppEth(transport)
      const { address } = await Promise.race([this._getAddressInfo(appEthereum, path), rejectOnTimeout(2000)])
      return address
    })
  }

  async signTransaction (txData, path) {
    return this._safeExec(async () => {
      const tx = new EthereumTx({
        ...txData,
        ...omitBy(
          {
            value:
              txData.value == null // nil check
                ? null
                : Web3Utils.toBN(txData.value),
            fee:
              txData.fee == null // nil check
                ? null
                : Web3Utils.toBN(txData.fee),
            gasLimit:
              txData.gasLimit == null // nil check
                ? null
                : Web3Utils.toBN(txData.gasLimit),
            gasPrice:
              txData.gasPrice == null // nil check
                ? null
                : Web3Utils.toBN(txData.gasPrice),
            nonce:
              txData.nonce == null // nil check
                ? null
                : Web3Utils.toBN(txData.nonce),
          },
          isNil
        ),
      })

      // // Set the EIP155 bits
      tx.raw[6] = Buffer.from([txData.chainId]) // v
      tx.raw[7] = Buffer.from([]) // r
      tx.raw[8] = Buffer.from([]) // s

      const transport = await TransportU2F.create()
      const app = new AppEth(transport)
      // Sign on ledger device
      this.emit('prompt', { device: this.name })
      const result = await app.signTransaction(path, tx.serialize().toString('hex'))

      // // Store signature in transaction
      tx.v = Buffer.from(result.v, 'hex')
      tx.r = Buffer.from(result.r, 'hex')
      tx.s = Buffer.from(result.s, 'hex')

      // EIP155: v should be chain_id * 2 + {35, 36}
      const signedChainId = Math.floor((tx.v[0] - 35) / 2)
      const validChainId = txData.chainId
      if (signedChainId !== validChainId) {
        throw new Error(`[SignerLedgerModel] Invalid networkId signature returned. Expected: ${validChainId}, Got: ${signedChainId}`)
      }

      return {
        rawTransaction: `0x${tx.serialize().toString('hex')}`,
      }
    })
  }

  async signData (data, path) {
    return this._safeExec(async () => {
      const transport = await TransportU2F.create()
      const app = new AppEth(transport)
      const result = await app.signPersonalMessage(path, Buffer.from(data).toString('hex'))
      const v = parseInt(result.v, 10) - 27
      let vHex = v.toString(16)
      if (vHex.length < 2) {
        vHex = `0${v}`
      }
      const signature = `0x${result.r}${result.s}${vHex}`

      return {
        signature: signature,
      }
    })
  }

  async getAddressInfo (path: String): String {
    const transport = await TransportU2F.create()
    const app = new AppEth(transport)
    const addressInfo = await this._getAddressInfo(app, path)

    return addressInfo
  }

  async _getAddressInfo (app, path: String): String {
    const { address, publicKey } = await app.getAddress(path)
    return {
      path,
      address,
      publicKey,
    }
  }

  async _safeExec (callable) {
    return this.lock.acquire(LOCK, callable)
  }
}
