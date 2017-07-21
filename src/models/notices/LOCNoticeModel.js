import React from 'react'
import { abstractNoticeModel } from './AbstractNoticeModel'
import { Translate, I18n } from 'react-redux-i18n'

export const statuses = {
  ADDED: 'locs.notice.added',
  REMOVED: 'locs.notice.removed',
  UPDATED: 'locs.notice.updated',
  STATUS_UPDATED: 'locs.notice.statusUpdated',
  ISSUED: 'locs.notice.issued',
  REVOKED: 'locs.notice.revoked',
  FAILED: 'locs.notice.failed'
}

class LOCNoticeModel extends abstractNoticeModel({
  action: null,
  name: null,
  amount: null
}) {
  id () {
    return `${this.time()} - ${Math.random()}`
  }

  message () {
    return this.get('amount')
      ? <Translate
        value='locs.notice.messageWithAmount'
        name={this.get('name')}
        action={I18n.t(this.get('action'))}
        amount={this.get('amount')}
      />
      : <Translate
        value='locs.notice.message'
        name={this.get('name')}
        action={I18n.t(this.get('action'))}
      />
  }
}

export default LOCNoticeModel
