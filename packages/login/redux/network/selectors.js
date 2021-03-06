/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import { getCustomNetworksList } from '@chronobank/core/redux/persistAccount/selectors'
import { getNetworkById } from '../../network/settings'
import { DUCK_NETWORK } from './constants'

export const getProfileSignatureSelector = () => createSelector(
  (state) => state.get(DUCK_NETWORK),
  (network) => {
    const { profileSignature } = network

    return profileSignature && profileSignature.profile
  },
)

export const getAccountProfileSummary = () => createSelector(
  [getProfileSignatureSelector],
  (profile) => {
    if (profile) {
      const level1 = profile.level1.submitted
      const level2 = profile.level2.submitted

      return {
        name: level1 && level1.userName,
        company: level2 && level2.company,
        phone: level2 && level2.phone,
        website: level2 && level2.website,
        avatar: level1 && level1.avatar && level1.avatar.url,
      }
    }
  },
)

export const getCurrentNetworkSelector = createSelector(
  [
    (state) => state.get(DUCK_NETWORK),
    getCustomNetworksList,
  ],
  (networkDuck, customNetworksList) => {
    const { selectedNetworkId, selectedProviderId } = networkDuck
    const network = getNetworkById(selectedNetworkId, selectedProviderId)
    const { protocol, host } = network

    if (!host) {
      const customNetwork = customNetworksList
        .find((network) => network.id === selectedNetworkId)

      return {
        network: customNetwork,
        url: customNetwork && customNetwork.url,
      }
    }

    return {
      network,
      url: protocol ? `${protocol}://${host}` : `//${host}`,
    }
  },
)
