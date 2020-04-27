import React, { Component } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

import '../../static/assets/styles/components/h2.scss';

// eslint-disable-next-line react/prefer-stateless-function
export default class H2 extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
  };

  static defaultProps = {
    className: '',
  };

  render() {
    const className = cx('pn-h2', this.props.className);

    return <h2 className={className}>{this.props.children}</h2>;
  }
}
