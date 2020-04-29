import actionCreator from '../actionCreators/createAccount';
import H2 from '../components/H2';
import CheckboxInput from '../components/CheckboxInput';
import Button from '../components/Button';
import PasswordInput from '../components/PasswordInput';
import TimezoneSelect, { nullValueInTimeZoneSelect } from '../components/TimeZoneSelect';
import { showModal, parseQueryString, formatDate, isPasswordStrongEnough } from '../utils/helpers';
import { roles } from '../utils/constants';
import { Select } from 'antd';
import DropdownDate from 'react-dropdown-date';
import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import '../../static/assets/styles/containers/createAccount.scss';

class UnconnectedCreateAccount extends Component {
  static propTypes = {
    isManagingUser: PropTypes.bool.isRequired,
    formFullName: PropTypes.string.isRequired,
    formTimeZone: PropTypes.string.isRequired,
    formRole: PropTypes.string.isRequired,
    formDob: PropTypes.string,
    formEmail: PropTypes.string.isRequired,
    formPassword: PropTypes.string.isRequired,
    formTermsAccepted: PropTypes.bool.isRequired,
    formNewsletterSubscribed: PropTypes.bool.isRequired,
    isUpdatingData: PropTypes.bool.isRequired,

    dispatchResetFormState: PropTypes.func.isRequired,
    dispatchSetFormField: PropTypes.func.isRequired,
    dispatchCreateAccount: PropTypes.func.isRequired,

    history: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    location: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  };

  static defaultProps = {
    formDob: undefined,
  };

  componentDidMount() {
    this.props.dispatchResetFormState();
  }

  handleInputChange(field, event) {
    this.props.dispatchSetFormField(field, event.target ? event.target.value : event);
  }

  handleCheckBoxChange = (field, isChecked) => {
    this.props.dispatchSetFormField(field, isChecked);
  };

  handleCreateAccount = event => {
    event.preventDefault();

    const {
      formFullName,
      formTimeZone,
      formRole,
      formDob,
      formEmail,
      formPassword,
      formTermsAccepted,
      formNewsletterSubscribed,
      history,
      isManagingUser,
    } = this.props;

    if (!formTermsAccepted) {
      showModal('Terms need to be accepted for account creation!');
    } else if (
      !formFullName ||
      formTimeZone === nullValueInTimeZoneSelect ||
      !formRole ||
      !formDob ||
      !formEmail ||
      !formPassword
    ) {
      showModal('At least one of the fields is missing!');
    } else if (!isPasswordStrongEnough(formPassword)) {
      showModal(
        'The password must contain at least one uppercase letter and one number and must be at least 8 characters!'
      );
    } else {
      this.props.dispatchCreateAccount(
        {
          fullName: formFullName,
          timeZone: formTimeZone,
          role: formRole,
          dob: formDob,
          email: formEmail,
          password: formPassword,
          termsAccepted: formTermsAccepted,
          newsletterSubscribed: formNewsletterSubscribed,
        },
        history,
        isManagingUser
      );
    }
  };

  render() {
    const { isManagingUser, formFullName, formTimeZone, formRole, formEmail, formPassword, formTermsAccepted, formNewsletterSubscribed, history, isUpdatingData, location } = this.props;

    return (
      <div id="create-account">
        <main>
          <H2>{isManagingUser ? 'Add New' : 'Create'} Account</H2>
          <h4>
            Signing up for TopTimes is fast and easy, you can start manage your timezones in a few
            seconds.
          </h4>

          <form>
            <div className="inputs">
              <div className="input-container">
                <label htmlFor="full-name">Full Name</label>
                <input
                  placeholder="John Doe"
                  id="full-name"
                  value={formFullName}
                  onChange={this.handleInputChange.bind(this, 'fullName')}
                />
              </div>

              <div className="input-container">
                <label htmlFor="time-zone">Timezone</label>
                <TimezoneSelect
                  id="time-zone"
                  onChange={this.handleInputChange.bind(this, 'timeZone')}
                  value={formTimeZone}
                />
              </div>

              <div className="input-container">
                <label htmlFor="role">Role</label>
                <Select
                  size="large"
                  className="custom-ant-select"
                  allowClear={false}
                  onChange={this.handleInputChange.bind(this, 'role')}
                  value={formRole}
                  id="role"
                >
                  <Select.Option value={roles.member}>{roles.member}</Select.Option>
                  <Select.Option value={roles.manager}>{roles.manager}</Select.Option>
                  <Select.Option value={roles.admin}>{roles.admin}</Select.Option>
                </Select>
              </div>

              <div className="input-container">
                <label htmlFor="dropdown-date">DOB</label>
                <DropdownDate
                  startDate="1905-01-01" // 'yyyy-mm-dd' format only
                  // selectedDate={formDob} // 'yyyy-mm-dd' format only
                  order={['month', 'day', 'year']}
                  onDateChange={date => {
                    const formattedDate = formatDate(date);

                    this.handleInputChange('dob', formattedDate);
                  }}
                  classes={{
                    dateContainer: 'custom-dropdown-date',
                    year: 'custom-dropdown-date-select',
                    month: 'custom-dropdown-date-select',
                    day: 'custom-dropdown-date-select',
                  }}
                  defaultValues={{ month: 'Month', day: 'Day', year: 'Year' }}
                  options={{ yearReverse: true, monthShort: true, monthCaps: false }}
                />
              </div>

              <div className="input-container">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  placeholder="you@email.com"
                  id="email"
                  value={formEmail}
                  onChange={this.handleInputChange.bind(this, 'email')}
                />
              </div>

              <div className="input-container">
                <label htmlFor="password">Create a password</label>
                <PasswordInput
                  value={formPassword}
                  onChange={this.handleInputChange.bind(this, 'password')}
                  placeholder="7 chars with a symbol and a number"
                  id="password"
                  autoComplete="current-password"
                />
              </div>
            </div>

            <hr className="inputs-agreement-top-separator" />

            <CheckboxInput
              onChange={this.handleCheckBoxChange.bind(this, 'termsAccepted')}
              value={formTermsAccepted}
            >
              I{isManagingUser && formFullName && `, on behalf of ${formFullName},`} agree to TopTimes’{' '}
              <a target="_blank" href="/pdf/term-of-use.pdf">
                Terms of Service
              </a>{' '}
              and <a href="#">E-Sign Consent</a>.
            </CheckboxInput>
            <CheckboxInput
              onChange={this.handleCheckBoxChange.bind(this, 'newsletterSubscribed')}
              value={formNewsletterSubscribed}
            >
              Please, from time to time, email me additional information on how TopTimes can help me
              stay safe from online harm.
            </CheckboxInput>

            <hr className="inputs-agreement-bottom-separator" />

            <div className="form-row">
              {isManagingUser ? (
                <Button
                  className="cancel-button"
                  type="button"
                  onClick={() => history.goBack()}
                  disabled={isUpdatingData}
                >
                  Cancel
                </Button>
              ) : (
                <p>
                  Already have a TopTimes account?{' '}
                  <Link to={`/login${location.search}`}>Sign in</Link>
                </p>
              )}
              <Button
                type="submit"
                onClick={this.handleCreateAccount}
                disabled={isUpdatingData}
              >
                Create Account
              </Button>
            </div>
          </form>
        </main>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  isManagingUser: !!parseQueryString(ownProps.location.search).isManagingUser,
  formFullName: state.createAccount.form.fullName.value,
  formTimeZone: state.createAccount.form.timeZone.value,
  formRole: state.createAccount.form.role.value,
  formDob: state.createAccount.form.dob.value,
  formEmail: state.createAccount.form.email.value,
  formPassword: state.createAccount.form.password.value,
  formTermsAccepted: state.createAccount.form.termsAccepted.value,
  formNewsletterSubscribed: state.createAccount.form.newsletterSubscribed.value,
  isUpdatingData: state.createAccount.updateData.isUpdatingData,
});

function mapDispatchToProps(dispatch) {
  return {
    dispatchResetFormState() {
      dispatch(actionCreator.resetFormState());
    },

    dispatchSetFormField(field, value) {
      dispatch(actionCreator.setFormField(field, value));
    },

    dispatchCreateAccount(...params) {
      dispatch(actionCreator.createAccount(...params));
    },
  };
}

const CreateAccount = connect(
  mapStateToProps,
  mapDispatchToProps
)(UnconnectedCreateAccount);

export { UnconnectedCreateAccount, CreateAccount as default };
