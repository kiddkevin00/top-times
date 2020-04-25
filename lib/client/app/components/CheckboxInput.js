import { FaCheck as CheckedMark } from 'react-icons/fa/';
import React, { Component } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

import '../../static/assets/styles/components/checkboxInput.scss';

export default class CheckboxInput extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.bool.isRequired,
    className: PropTypes.string,
  };

  static defaultProps = {
    className: '',
  };

  onKeyPress = event => {
    if (event.key === 'Enter') {
      this.props.onChange(!this.props.value);
    }
  };

  render() {
    const { className, onChange, value, children } = this.props;
    const clazzName = cx('pn-checkbox', className);

    return (
      <div
        className={clazzName}
        onClick={() => onChange(!value)}
        role="button"
        tabIndex="-1"
        onKeyPress={this.onKeyPress}
      >
        <div className="checked-mark-container">
          {value ? <CheckedMark /> : null}
        </div>

        <p>{children}</p>
      </div>
    );
  }
}
