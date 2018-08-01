const Joi = require('joi')
const uuid = require('uuid')
const AbstractModel = require('../../Core/lib/AbstractModel')
const BlockExecModel = require('./BlockExecModel')

const schemaFactory = () => ({
  key: Joi.string().required(),
  isLoading: Joi.boolean().required(),
  isLoaded: Joi.boolean().required(),
  address: Joi.string().required(),
  blocks: Joi.array().items(Joi.object().type(BlockExecModel.model)),
  lastBlock: Joi.number().allow(null),
  firstBlock: Joi.number().allow(null),
  cache: Joi.any(),
})

module.exports.schemaFactory = schemaFactory

module.exports.model = class TxHistoryModel extends AbstractModel {
  constructor (data, options) {
    super(Object.assign({
      key: uuid(),
      isLoading: false,
      isLoaded: false,
      blocks: [],
      lastBlock: null,
      firstBlock: null,
      cache: {},
    }, data), schemaFactory(), options)
    Object.freeze(this)
  }

  loaded ({ blocks, firstBlock }) {
    return new TxHistoryModel({
      ...this,
      key: uuid(),
      isLoaded: true,
      isLoading: false,
      blocks,
      firstBlock,
    })
  }

  withCachedTxDesc ({ desc }) {
    return new TxHistoryModel({
      ...this,
      cache: {
        ...this.cache,
        [desc.hash]: desc,
      },
    })
  }

  updated ({ blocks, lastBlock, firstBlock }) {
    return new TxHistoryModel({
      ...this,
      key: uuid(),
      blocks,
      lastBlock,
      firstBlock,
    })
  }

  get transactions () {
    const array = []
    for (const block of this.blocks) {
      array.push(...block.transactions)
    }
    return array
  }

  loading () {
    return new TxHistoryModel({
      ...this,
      key: uuid(),
      isLoading: true,
    })
  }
}
