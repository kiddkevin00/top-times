import actionCreator from '../actionCreators/forgotPassword';
import H2 from '../components/H2';
import Button from '../components/Button';
import { showModal } from '../utils/helpers';
import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import '../../static/assets/styles/containers/forgotPassword.scss';

class UnconnectedForgotPassword extends Component {
  static propTypes = {
    isUpdatingData: PropTypes.bool.isRequired,
    formEmail: PropTypes.string.isRequired,

    dispatchSetFormField: PropTypes.func.isRequired,
  };

  handleInputChange(field, event) {
    this.props.dispatchSetFormField(field, event.target.value);
  }

  handleForgotPassword = event => {
    event.preventDefault();

    const { formEmail } = this.props;

    if (!formEmail) {
      showModal('Email field is missing!');
    } else {
      // call the backend API to reset password
    }
  };

  render() {
    return (
      <div className="forgot-password">
        <main>
          <img src="/images/icon.png" alt="logo" />
          <H2>Forgot your password?</H2>

          <form>
            <input
              placeholder="Email"
              value={this.props.formEmail}
              onChange={this.handleInputChange.bind(this, 'email')}
            />
            <Button
              className="submit-button"
              type="submit"
              onClick={this.handleForgotPassword}
              disabled={this.props.isUpdatingData}
            >
              Reset My Password
            </Button>
          </form>

          <p>
            <Link to="/login">Back to Login</Link>
          </p>
        </main>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isUpdatingData: state.forgotPassword.updateData.isUpdatingData,
  formEmail: state.forgotPassword.form.email.value,
});

function mapDispatchToProps(dispatch) {
  return {
    dispatchSetFormField(field, value) {
      dispatch(actionCreator.setFormField(field, value));
    },
  };
}

const ForgotPassword = connect(
  mapStateToProps,
  mapDispatchToProps
)(UnconnectedForgotPassword);

export { UnconnectedForgotPassword, ForgotPassword as default };
