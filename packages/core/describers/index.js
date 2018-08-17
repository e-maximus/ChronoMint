/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import uuid from 'uuid/v1'
import BigNumber from 'bignumber.js'
import Web3ABI from 'web3-eth-abi'
import { Amount } from '../models'
import LogEventModel from '../models/LogEventModel'
import LogTxModel from '../models/LogTxModel'
import { EVENT_DESCRIBERS_BY_TOPIC, decodeLog } from './events'
import { TRANSACTION_DESCRIBERS_BY_TOPIC, decodeParameters, findFunctionABI } from './transactions'
import { decodeTxData } from '../utils/DecodeUtils'
import { ETH } from '../dao/constants'

export const describeEvent = (data, context) => {
  const { log, block } = data

  const array = EVENT_DESCRIBERS_BY_TOPIC[data.log.topics[0]]
  if (array) {
    for (const describer of array) {
      const { input, params } = decodeLog(describer.abi, data.log)
      const desc = describer.describe(data, context, { abi: describer.abi, input, params })
      if (desc) {
        return desc
      }
    }
  }

  console.warn('Unknown event: ', log.topics[0], data.log)

  return new LogEventModel({
    key: `${log.blockHash}/${log.transactionIndex}/${log.logIndex}`,
    type: 'event',
    name: 'custom',
    date: new Date(block.timestamp * 1000),
    icon: 'event',
    title: 'Custom event',
    message: `${log.address}`,
    target: null,
    amount: null,
  })
}

const formatPendingTxData = ({ abi, tx }) => {
  const data = abi != null && tx.data != null
    ? decodeTxData(abi.abi, tx.data)
    : (tx.data != null ? { name: 'Unknown contract' } : null)

  if (data) {
    const params = data.params.reduce((accumulator, entry) => ({ ...accumulator, [entry.name]: entry.value }), {})
    return {
      params,
      inputs: data.inputs,
      topic: Web3ABI.encodeFunctionSignature(findFunctionABI(abi, data.name)),
    }
  }
  return {}
}

const defaultDescription = (entry, context) => {
  const { tx, receipt, block } = entry
  const address = context.address.toLowerCase()

  const v = new BigNumber(tx.value)
  const fee = new BigNumber(tx.gasPrice).mul(receipt ? receipt.cumulativeGasUsed : tx.gasLimit)

  let value = null
  if (tx.from.toLowerCase() === address && tx.to.toLowerCase() === address) {
    value = fee.mul(-1)
  } else if (tx.from.toLowerCase() === address) {
    value = v.minus(fee)
  } else {
    value = v
  }

  const amount = new Amount(value, ETH)
  const path = `tx`
  return new LogTxModel({
    key: block ? `${block.hash}/${tx.transactionIndex}` : uuid(),
    type: 'tx',
    name: 'custom',
    date: new Date(block ? (block.timestamp * 1000) : null),
    icon: 'event',
    title: `${path}.title`,
    message: tx.to,
    target: null,
    fields: [
      {
        value: tx.from,
        description: `${path}.from`,
      },
      {
        value: tx.to,
        description: `${path}.to`,
      },
      {
        value: amount,
        description: `${path}.amount`,
      },
    ],
  })
}

export const describeTx = (entry, context = {}) => {
  const { tx, receipt } = entry
  const { abi } = context

  console.log('describeTx: ', tx, abi)

  let info
  if (!receipt) {
    info = formatPendingTxData({ abi, tx })
  } else {
    info = {
      topic: tx.input.substr(0, 10),
      ...decodeParameters(abi, entry.tx),
    }
  }

  const array = TRANSACTION_DESCRIBERS_BY_TOPIC[info.topic]
  if (array) {
    for (const describer of array) {
      const desc = describer.describe(entry, context, { abi: describer.abi, inputs: info.inputs, params: info.params, ...context })
      if (desc) {
        return desc
      }
    }
  }

  return defaultDescription(entry, context)
}
