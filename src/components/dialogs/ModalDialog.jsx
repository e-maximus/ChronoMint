/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */
import { CSSTransitionGroup } from 'react-transition-group'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import React, { PureComponent } from 'react'
import { modalsClose } from '@chronobank/core/redux/modals/actions'
import './ModalDialog.scss'

const TRANSITION_TIMEOUT = 300

function mapDispatchToProps (dispatch) {
  return {
    modalsClose: () => dispatch(modalsClose()),
  }
}

@connect(null, mapDispatchToProps)
export default class ModalDialog extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    modalsClose: PropTypes.func,
    onModalClose: PropTypes.func,
    title: PropTypes.node,
    hideCloseIcon: PropTypes.bool,
  }

  handleClose = (e) => {
    this.props.onModalClose ?
      this.props.onModalClose()
      : this.props.modalsClose()
    e.stopPropagation()
  }

  handleStopPropagation = (e) => {
    e.stopPropagation()
  }

  render () {
    return (
      <CSSTransitionGroup
        transitionName='transition-opacity'
        transitionEnterTimeout={TRANSITION_TIMEOUT}
        transitionLeaveTimeout={TRANSITION_TIMEOUT}
      >
        <div styleName='root'>
          <div styleName='dialog' onClick={this.handleStopPropagation}>
            {this.props.title && (
              <div styleName='header'>
                {this.props.title}
              </div>
            )}
            <div styleName='content'>
              {this.props.children}
            </div>
            {!this.props.hideCloseIcon && (
              <div styleName='close' onClick={this.handleClose}>
                <i className='material-icons'>close</i>
              </div>
            )}
          </div>
        </div>
      </CSSTransitionGroup>
    )
  }
}
