import Joi from 'joi'
import { ValidationError } from '../../../errors'

// FIXME: what is it?
const debug = require('debug')('@laborx/exchange.core')

export default class AbstractModel {
  constructor (data, schema, options = {}) {
    try {
      const { error, value } = Joi.validate(
        (data instanceof Function) ? data(this) : data,
        (schema instanceof Function) ? schema() : schema,
        options
      )
      if (error) {
        throw new ValidationError(`[${this.constructor.name}].${error}`)
      }
      Object.assign(this, value)
    } catch (e) {
      debug(e.message, e.stack, data)
      throw e
    }
  }

  static buildArray (array, buildItem, context) {
    return array == null
      ? null
      : array.map((item) => buildItem(item, context))
  }
}
