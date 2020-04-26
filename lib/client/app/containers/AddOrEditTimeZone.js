import actionCreator from '../actionCreators/addOrEditTimeZone';
import H2 from '../components/H2';
import Button from '../components/Button';
import { showModal, willRedirectBackFromLogin, parseQueryString } from '../utils/helpers';
import { allAvailableTimeZones, errorMessages } from '../utils/constants';
import { Select } from 'antd';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import '../../static/assets/styles/containers/addOrEditTimeZone.scss';

class UnconnectedAddOrEditTimeZone extends Component {
  static propTypes = {
    isAdding: PropTypes.bool.isRequired,
    timeZoneId: PropTypes.string,
    userId: PropTypes.string,
    formDisplayName: PropTypes.string.isRequired,
    formCityInTimeZone: PropTypes.string,
    formCustomCityName: PropTypes.string.isRequired,
    formNotes: PropTypes.string.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    isUpdatingData: PropTypes.bool.isRequired,

    dispatchResetState: PropTypes.func.isRequired,
    dispatchSetFormField: PropTypes.func.isRequired,
    dispatchInitialize: PropTypes.func.isRequired,
    dispatchAddOrEditTimeZone: PropTypes.func.isRequired,

    history: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  };

  static defaultProps = {
    timeZoneId: undefined,
    userId: undefined,
    formCityInTimeZone: undefined,
  };

  async componentDidMount() {
    const { dispatchResetState, dispatchInitialize, timeZoneId, userId, history } = this.props;

    dispatchResetState();

    try {
      await dispatchInitialize(timeZoneId, userId);
    } catch (err) {
      if (err.message === errorMessages.unauthenticated) {
        willRedirectBackFromLogin(history);
      }
    }
  }

  handleInputChange(field, eventOrValue) {
    this.props.dispatchSetFormField(
      field,
      eventOrValue && eventOrValue.target ? eventOrValue.target.value : eventOrValue
    );
  }

  handleAddOrEditTimeZone = event => {
    event.preventDefault();

    const {
      formDisplayName,
      formCityInTimeZone,
      formCustomCityName,
      formNotes,
      history,
      timeZoneId,
      userId,
    } = this.props;

    if (!formDisplayName || !formCityInTimeZone) {
      showModal('At least one of the required fields is missing!');
    } else {
      this.props.dispatchAddOrEditTimeZone(
        {
          displayName: formDisplayName,
          cityInTimeZone: formCityInTimeZone,
          customCityName: formCustomCityName,
          notes: formNotes,
        },
        history,
        timeZoneId,
        userId
      );
    }
  };

  render() {
    const {
      isAdding,
      isAuthenticated,
      formDisplayName,
      formCityInTimeZone,
      formCustomCityName,
      formNotes,
      history,
      isUpdatingData,
    } = this.props;

    if (!isAuthenticated) {
      return null;
    }

    return (
      <div id="add-or-edit-time-zone">
        <main>
          <H2>{isAdding ? 'Add a Timezone' : 'Timezone Information'}</H2>
          <h4>{isAdding ? 'Add and manage' : 'Manage'} your timezone information can never be easier.</h4>

          <form>
            <div className="inputs">
              <div className="input-container">
                <label htmlFor="display-name">Display Name</label>
                <input
                  placeholder="Home Sweat Home"
                  id="display-name"
                  value={formDisplayName}
                  onChange={this.handleInputChange.bind(this, 'displayName')}
                />
              </div>

              <div className="input-container">
                <label htmlFor="city-in-time-zone">City in Timezone</label>
                <Select
                  size="large"
                  className="custom-ant-select"
                  allowClear={true}
                  showSearch={true}
                  onChange={this.handleInputChange.bind(this, 'cityInTimeZone')}
                  value={formCityInTimeZone}
                  id="city-in-time-zone"
                  placeholder="Select a City"
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {allAvailableTimeZones.map(timeZone => (
                    <Select.Option key={timeZone} value={timeZone}>
                      {timeZone}
                    </Select.Option>
                  ))}
                </Select>
              </div>

              <div className="input-container">
                <label htmlFor="custom-city-name">Custom City Name (Optional)</label>
                <input
                  placeholder="Jersey City"
                  id="custom-city-name"
                  value={formCustomCityName}
                  onChange={this.handleInputChange.bind(this, 'customCityName')}
                />
              </div>

              <div className="input-container">
                <label htmlFor="notes">Notes (Optional)</label>
                <input
                  placeholder="This is where I grow up and where my parents live..."
                  id="notes"
                  value={formNotes}
                  onChange={this.handleInputChange.bind(this, 'notes')}
                />
              </div>
            </div>

            <hr className="inputs-agreement-top-separator" />

            <div className="form-row">
              <Button
                className="cancel-button"
                type="button"
                onClick={() => history.goBack()}
                disabled={isUpdatingData}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={this.handleAddOrEditTimeZone}
                disabled={isUpdatingData}
              >
                {isAdding ? 'Add Timezone' : 'Save'}
              </Button>
            </div>
          </form>
        </main>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { timeZoneId, userId } = parseQueryString(ownProps.location.search);
  const isAdding = !timeZoneId;
  const addOrEditTimeZoneForm = state.addOrEditTimeZone.form;
  const addOrEditTimeZoneMain = state.addOrEditTimeZone.main;

  return {
    isAdding,
    timeZoneId,
    userId,
    formDisplayName: addOrEditTimeZoneForm.displayName.dirty
      ? addOrEditTimeZoneForm.displayName.value
      : addOrEditTimeZoneMain.displayName,
    formCityInTimeZone: addOrEditTimeZoneForm.cityInTimeZone.dirty
      ? addOrEditTimeZoneForm.cityInTimeZone.value
      : addOrEditTimeZoneMain.cityInTimeZone,
    formCustomCityName: addOrEditTimeZoneForm.customCityName.dirty
      ? addOrEditTimeZoneForm.customCityName.value
      : addOrEditTimeZoneMain.customCityName,
    formNotes: addOrEditTimeZoneForm.notes.dirty
      ? addOrEditTimeZoneForm.notes.value
      : addOrEditTimeZoneMain.notes,
    isAuthenticated: state.me.main.isAuthenticated,
    isLoadingData: state.addOrEditTimeZone.loadData.isLoadingData,
    isUpdatingData: state.addOrEditTimeZone.updateData.isUpdatingData,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    dispatchResetState() {
      dispatch(actionCreator.resetState());
    },

    dispatchSetFormField(field, value) {
      dispatch(actionCreator.setFormField(field, value));
    },

    dispatchInitialize(...params) {
      return dispatch(actionCreator.initialize(...params));
    },

    dispatchAddOrEditTimeZone(...params) {
      dispatch(actionCreator.addOrEditTimeZone(...params));
    },
  };
}

const AddOrEditTimeZone = connect(
  mapStateToProps,
  mapDispatchToProps
)(UnconnectedAddOrEditTimeZone);

export { UnconnectedAddOrEditTimeZone, AddOrEditTimeZone as default };
