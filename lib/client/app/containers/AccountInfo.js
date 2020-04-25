import actionCreator from '../actionCreators/accountInfo';
import H2 from '../components/H2';
import CheckboxInput from '../components/CheckboxInput';
import Button from '../components/Button';
import PasswordInput from '../components/PasswordInput';
import TimeZoneSelect from '../components/TimeZoneSelect';
import {
  showModal,
  formatDate,
  willRedirectBackFromLogin,
  isPasswordStrongEnough,
} from '../utils/helpers';
import { errorMessages, roles } from '../utils/constants';
import { Select } from 'antd';
import DropdownDate from 'react-dropdown-date';
import { addDays, format, parse, subYears } from 'date-fns';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import '../../static/assets/styles/containers/accountInfo.scss';

class UnconnectedAccountInfo extends Component {
  static propTypes = {
    isMyProfile: PropTypes.bool.isRequired,
    formFullName: PropTypes.string.isRequired,
    formTimeZone: PropTypes.string,
    formRole: PropTypes.string,
    formDob: PropTypes.string,
    formEmail: PropTypes.string.isRequired,
    formPassword: PropTypes.string.isRequired,
    formNewsletterSubscribed: PropTypes.bool.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    isLoadingData: PropTypes.bool.isRequired,
    isUpdatingData: PropTypes.bool.isRequired,

    dispatchResetFormState: PropTypes.func.isRequired,
    dispatchSetFormField: PropTypes.func.isRequired,
    dispatchInitialize: PropTypes.func.isRequired,
    dispatchUpdateProfile: PropTypes.func.isRequired,

    history: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    match: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  };

  static defaultProps = {
    formTimeZone: undefined,
    formRole: undefined,
    formDob: undefined,
  };

  async componentDidMount() {
    try {
      this.props.dispatchResetFormState();

      await this.props.dispatchInitialize(this.props.match.params.id);
    } catch (err) {
      if (err.message === errorMessages.unauthenticated) {
        willRedirectBackFromLogin(this.props.history);
      }
    }
  }

  handleInputChange(field, event) {
    this.props.dispatchSetFormField(field, event.target ? event.target.value : event);
  }

  handleCheckBoxChange = (field, isChecked) => {
    this.props.dispatchSetFormField(field, isChecked);
  };

  handleSaveChanges = event => {
    event.preventDefault();

    const {
      formFullName,
      formTimeZone,
      formRole,
      formDob,
      formEmail,
      formPassword,
      formNewsletterSubscribed,
    } = this.props;

    if (!formFullName || !formTimeZone || !formRole || !formDob || !formEmail) {
      showModal('At least one of the fields is missing!');
    } else if (formPassword && !isPasswordStrongEnough(formPassword)) {
      showModal(
        'The password must contain at least one uppercase letter and one number and must be at least 8 characters!'
      );
    } else {
      this.props.dispatchUpdateProfile(
        {
          fullName: formFullName,
          timeZone: formTimeZone,
          role: formRole,
          dob: formDob,
          email: formEmail,
          newsletterSubscribed: formNewsletterSubscribed,
          password: formPassword,
        },
        this.props.match.params.id,
        this.props.history
      );
    }
  };

  render() {
    const {
      isLoadingData,
      isAuthenticated,
      isMyProfile,
      formFullName,
      formTimeZone,
      formRole,
      formDob,
      formEmail,
      formPassword,
      formNewsletterSubscribed,
      dispatchResetFormState,
      history,
      isUpdatingData,
    } = this.props;

    if (isLoadingData || !isAuthenticated) {
      return null;
    }

    return (
      <div className="account-info">
        <main>
          <H2>{isMyProfile && 'My'} Account Information</H2>

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
                <label htmlFor="timer-zone">Time Zone</label>
                <TimeZoneSelect
                  id="timer-zone"
                  onChange={this.handleInputChange.bind(this, 'timeZone')}
                  value={formTimeZone}
                />
              </div>

              <div className="input-container">
                <label htmlFor="role">Role</label>
                <Select
                  size="large"
                  className="role-select"
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
                  selectedDate={
                    formDob &&
                    format(parse(formDob, 'yyyy-MM-dd', subYears(new Date(), 18)), 'MM/dd/yyyy')
                  } // 'yyyy-mm-dd' format only
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
              onChange={this.handleCheckBoxChange.bind(this, 'newsletterSubscribed')}
              value={formNewsletterSubscribed}
            >
              Please, from time to time, email me additional information on how TopTimes can help me
              manage time zones.
            </CheckboxInput>

            <hr className="inputs-agreement-bottom-separator" />

            <div className="form-row">
              <Button
                className="cancel-changes-button"
                type="button"
                onClick={isMyProfile ? dispatchResetFormState : () => history.goBack()}
                disabled={isUpdatingData}
              >
                CANCEL
              </Button>
              <Button type="submit" onClick={this.handleSaveChanges} disabled={isUpdatingData}>
                SAVE
              </Button>
            </div>
          </form>
        </main>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { id } = ownProps.match.params;
  const isMyProfile = !id;
  const accountInfoForm = state.accountInfo.form;
  const accountInfoMain = state.accountInfo.main;

  return {
    isMyProfile,
    formFullName: accountInfoForm.fullName.dirty
      ? accountInfoForm.fullName.value
      : accountInfoMain.fullName,
    formTimeZone: accountInfoForm.timeZone.dirty
      ? accountInfoForm.timeZone.value
      : accountInfoMain.timeZone,
    formRole: accountInfoForm.role.dirty ? accountInfoForm.role.value : accountInfoMain.role,
    formDob: accountInfoForm.dob.dirty ? accountInfoForm.dob.value : accountInfoMain.dob,
    formEmail: accountInfoForm.email.dirty ? accountInfoForm.email.value : accountInfoMain.email,
    formPassword: accountInfoForm.password.dirty ? accountInfoForm.password.value : '',
    formNewsletterSubscribed: accountInfoForm.newsletterSubscribed.dirty
      ? accountInfoForm.newsletterSubscribed.value
      : accountInfoMain.newsletterSubscribed,
    isAuthenticated: state.me.main.isAuthenticated,
    isLoadingData: state.accountInfo.loadData.isLoadingData,
    isUpdatingData: state.accountInfo.updateData.isUpdatingData,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    dispatchResetFormState() {
      dispatch(actionCreator.resetFormState());
    },

    dispatchSetFormField(field, value) {
      dispatch(actionCreator.setFormField(field, value));
    },

    dispatchInitialize(id) {
      return dispatch(actionCreator.initialize(id));
    },

    dispatchUpdateProfile(...params) {
      dispatch(actionCreator.updateUserProfile(...params));
    },
  };
}

const AccountInfo = connect(
  mapStateToProps,
  mapDispatchToProps
)(UnconnectedAccountInfo);

export { UnconnectedAccountInfo, AccountInfo as default };
