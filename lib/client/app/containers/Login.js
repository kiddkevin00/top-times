import actionCreator from '../actionCreators/login';
import H2 from '../components/H2';
import Button from '../components/Button';
import PasswordInput from '../components/PasswordInput';
import { showModal, parseQueryString } from '../utils/helpers';
import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import '../../static/assets/styles/containers/login.scss';

class UnconnectedLogin extends Component {
  static propTypes = {
    isUpdatingData: PropTypes.bool.isRequired,
    formIdentifier: PropTypes.string.isRequired,
    formPassword: PropTypes.string.isRequired,

    dispatchResetState: PropTypes.func.isRequired,
    dispatchSetFormField: PropTypes.func.isRequired,
    dispatchLogin: PropTypes.func.isRequired,

    history: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    location: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  };

  constructor(props) {
    super(props);

    const queryParams = parseQueryString(props.location.search);
    const redirectUrl = queryParams.redirect_url || '';
    const absPath = redirectUrl.replace(/^[/\\]*/, '/');

    this.redirectUrl = absPath;
  }

  componentDidMount() {
    this.props.dispatchResetState();
  }

  handleInputChange(field, event) {
    this.props.dispatchSetFormField(field, event.target.value);
  }

  handleLogin = event => {
    event.preventDefault();

    const { formIdentifier, formPassword, history } = this.props;

    if (!formIdentifier || !formPassword) {
      showModal('At least one of the fields is missing!');
      return;
    }

    this.props.dispatchLogin(history, formIdentifier, formPassword, this.redirectUrl);
  };

  render() {
    return (
      <div className="login">
        <main>
          <img src="/images/icon.png" alt="logo" />
          <H2>Please login to your account below</H2>

          <form>
            <input
              placeholder="Email"
              value={this.props.formIdentifier}
              onChange={this.handleInputChange.bind(this, 'identifier')}
            />
            <PasswordInput
              value={this.props.formPassword}
              onChange={this.handleInputChange.bind(this, 'password')}
            />
            <Button
              className="submit-button"
              type="submit"
              onClick={this.handleLogin}
              disabled={this.props.isUpdatingData}
            >
              Sign In
            </Button>
          </form>

          <p>
            <Link to="/forgot-password">Forgot your password?</Link>
          </p>
        </main>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isUpdatingData: state.login.updateData.isUpdatingData,
  formIdentifier: state.login.form.identifier.value,
  formPassword: state.login.form.password.value,
});

function mapDispatchToProps(dispatch) {
  return {
    dispatchResetState() {
      dispatch(actionCreator.resetState());
    },

    dispatchSetFormField(field, value) {
      dispatch(actionCreator.setFormField(field, value));
    },

    dispatchLogin(...params) {
      dispatch(actionCreator.login(...params));
    },
  };
}

const Login = connect(
  mapStateToProps,
  mapDispatchToProps
)(UnconnectedLogin);

export { UnconnectedLogin, Login as default };
