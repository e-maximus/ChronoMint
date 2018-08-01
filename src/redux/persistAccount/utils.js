/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 *
 * @flow
 */

import {
  type AccountEntryModel,
} from '@chronobank/core/models/wallet/persistAccount'
import {
  DEFAULT_AVATAR,
} from '../../components/constants'

// eslint-disable-next-line import/prefer-default-export
export const getAccountAvatar = (account: AccountEntryModel) => {
  const isAvatarCreated = account && account.profile && account.profile.avatar
  return isAvatarCreated
    ? account.profile.avatar
    : DEFAULT_AVATAR
}
