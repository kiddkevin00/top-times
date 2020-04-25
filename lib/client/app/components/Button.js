import React, { Component } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

import '../../static/assets/styles/components/button.scss';

// eslint-disable-next-line react/prefer-stateless-function
export default class Button extends Component {
  render() {
    const className = cx('pn-button', this.props.className);

    return (
      <button
        className={className}
        onClick={this.props.onClick}
        type={this.props.type}
        disabled={this.props.disabled}
      >
        {this.props.children}
      </button>
    );
  }
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  type: PropTypes.string,
  disabled: PropTypes.bool,
};

Button.defaultProps = {
  className: '',
  type: 'button',
  disabled: false,
};
