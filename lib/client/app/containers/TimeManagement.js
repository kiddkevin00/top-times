import actionCreator from '../actionCreators/timeManagement';
import CheckboxInput from '../components/CheckboxInput';
import Button from '../components/Button';
import { willRedirectBackFromLogin } from '../utils/helpers';
import { errorMessages, timeZonesSortBy, roles } from '../utils/constants';
import cityCountryCodeMap from '../utils/cityCountryCodeMap.json';
import { Select, List, Skeleton, Icon } from 'antd';
import ReactCountryFlag from 'react-country-flag';
import moment from 'moment-timezone';
import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import '../../static/assets/styles/containers/timeManagement.scss';

class UnconnectedTimeManagement extends Component {
  static propTypes = {
    isManagingUser: PropTypes.bool.isRequired,
    myRole: PropTypes.string,
    formSearch: PropTypes.string.isRequired,
    formSortBy: PropTypes.string,
    formShowNearbyTimeZonesOnly: PropTypes.bool.isRequired,
    formShowCurrentTimeZoneOnly: PropTypes.bool.isRequired,
    timeZones: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        displayName: PropTypes.string.isRequired,
        cityInTimeZone: PropTypes.string.isRequired,
        customCityName: PropTypes.string,
        notes: PropTypes.string,
      })
    ).isRequired,
    isLoadingData: PropTypes.bool.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,

    dispatchSetFormField: PropTypes.func.isRequired,
    dispatchInitialize: PropTypes.func.isRequired,
    dispatchRemoveTimeZone: PropTypes.func.isRequired,

    history: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    match: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  };

  static defaultProps = {
    myRole: undefined,
    formSortBy: undefined,
  };

  async componentDidMount() {
    try {
      await this.props.dispatchInitialize(this.props.match.params.userId);
    } catch (err) {
      if (err.message === errorMessages.unauthenticated) {
        willRedirectBackFromLogin(this.props.history);
      }
    }
  }

  handleInputChange(field, eventOrValue) {
    this.props.dispatchSetFormField(
      field,
      eventOrValue && eventOrValue.target ? eventOrValue.target.value : eventOrValue
    );
  }

  render() {
    const {
      isManagingUser,
      isLoadingData,
      isAuthenticated,
      myRole,
      timeZones,
      formSearch,
      formSortBy,
      formShowNearbyTimeZonesOnly,
      formShowCurrentTimeZoneOnly,
      history,
      match,
    } = this.props;

    if (!isAuthenticated) {
      return null;
    }

    if (isManagingUser && myRole !== roles.admin) {
      return null;
    }

    const timeZonesDataSource = timeZones
      .map(timeZone => {
        const timeZoneForMoment = timeZone.cityInTimeZone.replace(' ', '_');
        const currentTimeInTimeZone = moment().tz(timeZoneForMoment);
        const currentTimeInTimeZoneConvertedToCurrentTimeZone = moment(
          currentTimeInTimeZone.format('YYYY-MM-DDTHH:mm:ss.SSSSSSSSS')
        );

        const utcDiff = currentTimeInTimeZone.format('Z');
        const timeZoneAbbr = currentTimeInTimeZone.format('z');

        const cityNameStartIndex = timeZone.cityInTimeZone.lastIndexOf('/') + 1;
        const cityName = timeZone.cityInTimeZone.slice(cityNameStartIndex).toLowerCase();

        const currentCalendarTime = currentTimeInTimeZoneConvertedToCurrentTimeZone.calendar();
        const [dateDiff, currentTime] = currentCalendarTime.split(' at ');
        const diffToBrowserTime = Math.round(
          currentTimeInTimeZoneConvertedToCurrentTimeZone.diff(moment(), 'hours', true)
        );

        return {
          ...timeZone,
          timeZoneDisplay: `(UTC${utcDiff}) ${timeZone.cityInTimeZone} (${timeZoneAbbr})`,
          countryCode: cityCountryCodeMap[cityName],
          currentTime,
          diffToBrowserTimeDisplay: `${dateDiff}, ${
            diffToBrowserTime >= 0 ? '+' : ''
          }${diffToBrowserTime} HRS`,
          diffToBrowserTime,
        };
      })
      .filter(timeZone => {
        let willBeIncluded = true;

        if (formSearch) {
          const searchAgainst = `${timeZone.displayName} ${
            timeZone.cityInTimeZone
          } ${timeZone.customCityName || ''} ${timeZone.timeZoneDisplay} ${timeZone.currentTime} ${
            timeZone.diffToBrowserTimeDisplay
          }`.toLowerCase();

          if (searchAgainst.includes(formSearch.toLowerCase())) {
            willBeIncluded = true;
          } else {
            willBeIncluded = false;
          }
        }

        if (willBeIncluded && (formShowNearbyTimeZonesOnly || formShowCurrentTimeZoneOnly)) {
          willBeIncluded = false;

          if (formShowNearbyTimeZonesOnly && Math.abs(timeZone.diffToBrowserTime) <= 3) {
            willBeIncluded = true;
          }

          if (formShowCurrentTimeZoneOnly && timeZone.diffToBrowserTime === 0) {
            willBeIncluded = true;
          }
        }

        return willBeIncluded;
      })
      .sort((first, second) => {
        if (formSortBy) {
          if (formSortBy === timeZonesSortBy.name) {
            return first.displayName.toLowerCase().localeCompare(second.displayName.toLowerCase());
          }

          if (formSortBy === timeZonesSortBy.city) {
            return (first.customCityName || first.cityInTimeZone)
              .toLowerCase()
              .localeCompare((second.customCityName || second.cityInTimeZone).toLowerCase());
          }

          if (formSortBy === timeZonesSortBy.differenceWithGmt) {
            return Math.abs(first.diffToBrowserTime) - Math.abs(second.diffToBrowserTime);
          }
        }
        return first.dateCreated - second.dateCreated;
      });

    return (
      <div className="time-management">
        <main>
          <div className="white-board">
            <div className="main-header">
              <h4>
                {isManagingUser && (
                  <span className="link" onClick={() => history.goBack()}>
                    <Icon type="left" className="back-icon" />
                  </span>
                )}
                {isManagingUser ? 'Manage' : 'My'} Timezones
              </h4>
              <Button
                type="button"
                onClick={() =>
                  history.push(
                    `/manage-timezone${isManagingUser ? `?userId=${match.params.userId}` : ''}`
                  )}
              >
                Add
              </Button>
            </div>
            <div className="panes">
              <section className="pane control">
                <Select
                  className="sort-by-select"
                  allowClear={true}
                  onChange={this.handleInputChange.bind(this, 'sortBy')}
                  placeholder="Select a Field to Sort By"
                  value={formSortBy}
                >
                  <Select.Option value={timeZonesSortBy.name}>{timeZonesSortBy.name}</Select.Option>
                  <Select.Option value={timeZonesSortBy.city}>{timeZonesSortBy.city}</Select.Option>
                  <Select.Option value={timeZonesSortBy.differenceWithGmt}>
                    {timeZonesSortBy.differenceWithGmt}
                  </Select.Option>
                </Select>

                <input
                  className="search-input"
                  value={formSearch}
                  onChange={this.handleInputChange.bind(this, 'search')}
                  placeholder="Search timezones"
                />
                <CheckboxInput
                  onChange={this.handleInputChange.bind(this, 'showCurrentTimeZoneOnly')}
                  value={formShowCurrentTimeZoneOnly}
                >
                  Show current timezone only
                </CheckboxInput>
                <CheckboxInput
                  onChange={this.handleInputChange.bind(this, 'showNearbyTimeZonesOnly')}
                  value={formShowNearbyTimeZonesOnly}
                >
                  Show nearby timezones
                </CheckboxInput>
              </section>

              <section className="pane">
                <List
                  className="time-zone-or-user-list"
                  loading={isLoadingData}
                  itemLayout="horizontal"
                  dataSource={timeZonesDataSource}
                  renderItem={item => (
                    <List.Item
                      actions={[
                        <Link
                          key="list-edit"
                          to={`/manage-timezone?timeZoneId=${item._id}${
                            isManagingUser ? `&userId=${match.params.userId}` : ''
                          }`}
                        >
                          Edit
                        </Link>,
                        <span
                          key="list-delete"
                          className="link"
                          onClick={() =>
                            this.props.dispatchRemoveTimeZone(item._id, match.params.userId)}
                        >
                          Delete
                        </span>,
                      ]}
                    >
                      <Skeleton loading={isLoadingData} avatar={true} title={false} active={true}>
                        <List.Item.Meta
                          avatar={(
                            <ReactCountryFlag
                              countryCode={item.countryCode || 'US'}
                              svg={true}
                              className="flag-icon"
                            />
                          )}
                          title={`${item.displayName} (${item.customCityName ||
                            item.cityInTimeZone})`}
                          description={(
                            <span style={{ fontSize: '17px' }}>
                              {`${item.currentTime} (${item.diffToBrowserTimeDisplay})`}
                            </span>
                          )}
                        />
                        <div className="extra-info">{item.timeZoneDisplay}</div>
                      </Skeleton>
                    </List.Item>
                  )}
                />
              </section>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  isManagingUser: !!ownProps.match.params.userId,
  myRole: state.me.main.role,
  formSearch: state.timeManagement.form.search.value,
  formSortBy: state.timeManagement.form.sortBy.value,
  formShowNearbyTimeZonesOnly: state.timeManagement.form.showNearbyTimeZonesOnly.value,
  formShowCurrentTimeZoneOnly: state.timeManagement.form.showCurrentTimeZoneOnly.value,
  timeZones: state.timeManagement.main.timeZones,
  isLoadingData: state.timeManagement.loadData.isLoadingData,
  isAuthenticated: state.me.main.isAuthenticated,
});

function mapDispatchToProps(dispatch) {
  return {
    dispatchSetFormField(field, value) {
      dispatch(actionCreator.setFormField(field, value));
    },

    dispatchInitialize(...params) {
      return dispatch(actionCreator.initialize(...params));
    },

    dispatchRemoveTimeZone(...params) {
      dispatch(actionCreator.removeTimeZone(...params));
    },
  };
}

const TimeManagement = connect(
  mapStateToProps,
  mapDispatchToProps
)(UnconnectedTimeManagement);

export { UnconnectedTimeManagement, TimeManagement as default };
