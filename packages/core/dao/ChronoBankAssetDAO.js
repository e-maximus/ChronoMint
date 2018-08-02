/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { MultiEventsHistoryABI, ChronoBankAssetABI } from './abi'
import AbstractContractDAO from './AbstractContractDAO'

//#region CONSTANTS

import {
  CALL_BLACKLIST,
  CALL_PAUSED,
  TX_PAUSE,
  // TX_PAUSED,
  TX_RESTRICT,
  // TX_RESTRICTED,
  TX_UNPAUSE,
  // TX_UNPAUSED,
  TX_UNRESTRICT,
  // TX_UNRESTRICTED,
} from './constants/ChronoBankAssetDAO'

//#endregion CONSTANTS

export default class ChronoBankAssetDAO extends AbstractContractDAO {

  constructor (at = null) {
    super(ChronoBankAssetABI, at, MultiEventsHistoryABI)
  }

  getPauseStatus () {
    return this._call(CALL_PAUSED)
  }

  pause () {
    return this._tx(TX_PAUSE)
  }

  unpause () {
    return this._tx(TX_UNPAUSE)
  }

  restrict (address: Array<string>): boolean {
    return this._tx(TX_RESTRICT, [ address ])
  }

  unrestrict (address: Array<string>): boolean {
    return this._tx(TX_UNRESTRICT, [ address ])
  }

  blacklist (address): boolean {
    return this._call(CALL_BLACKLIST, [ address ])
  }
}
