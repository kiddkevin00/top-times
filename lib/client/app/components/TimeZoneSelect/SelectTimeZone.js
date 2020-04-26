import timezones from './timezones.json';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class SelectTimeZone extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    className: PropTypes.string,
    id: PropTypes.string,
    value: PropTypes.string,
  };

  static defaultProps = {
    className: '',
    id: undefined,
    value: undefined,
  };

  static nullValueInTimeZoneSelect = timezones[0].name;

  _handleChange = event => {
    this.props.onChange(event.target.value);
  };

  render() {
    const idProps = this.props.id ? { id: this.props.id } : {};

    return (
      <select
        {...idProps} // eslint-disable-line react/jsx-props-no-spreading
        className={this.props.className}
        onChange={this._handleChange}
        value={this.props.value}
      >
        {timezones.map(item => (
          <option key={item.name} value={item.name}>
            {item.name}
          </option>
        ))}
      </select>
    );
  }
}

export { SelectTimeZone as default };
