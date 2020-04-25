import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import '../../static/assets/styles/components/passwordInput.scss';

class PasswordInput extends Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
  };

  static defaultProps = {
    placeholder: 'Password',
  };

  state = { showPassword: false };

  toggleVisibility = event => {
    event.stopPropagation();

    this.setState({
      showPassword: !this.state.showPassword,
    });
  };

  render() {
    const type = this.state.showPassword ? 'text' : 'password';
    const { value, onChange, placeholder, ...otherProps } = this.props;
    const passwordVisibilityToggleClassName = cx('password-visibility-toggle', {
      enabled: value && value.length,
      disabled: !(value && value.length),
    });

    return (
      <div className="password-input-container">
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          {...otherProps}
        />
        {/* eslint-disable jsx-a11y/interactive-supports-focus, jsx-a11y/click-events-have-key-events */}
        <span
          onClick={this.toggleVisibility}
          className={passwordVisibilityToggleClassName}
          role="button"
        >
          {!this.state.showPassword ? 'Show' : 'Hide'}
        </span>
        {/* eslint-enable jsx-a11y/interactive-supports-focus, jsx-a11y/click-events-have-key-events */}
      </div>
    );
  }
}

export { PasswordInput as default };
