/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import AbstractContractDAO from './AbstractContractDAO'
import { PlatformTokenExtensionGatewayManagerEmitterABI, MultiEventsHistoryABI } from './abi'

import {
  TX_ASSET_CREATED,
} from './constants/AssetsManagerDAO'

export default class PlatformTokenExtensionGatewayManagerEmitterDAO extends AbstractContractDAO {

  constructor (at = null) {
    super(PlatformTokenExtensionGatewayManagerEmitterABI, at, MultiEventsHistoryABI)
  }

  watchAssetCreate (callback, account) {
    this._watch(TX_ASSET_CREATED, callback, { by: account })
  }
}
