import actionCreator from '../actionCreators/timeManagement';
import CheckboxInput from '../components/CheckboxInput';
import Button from '../components/Button';
import { willRedirectBackFromLogin } from '../utils/helpers';
import { errorMessages, timeZonesSortBy } from '../utils/constants';
import { Select, List, Skeleton } from 'antd';
import ReactCountryFlag from 'react-country-flag';
import { format, parse, parseISO } from 'date-fns';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import '../../static/assets/styles/containers/timeManagement.scss';

const data = [
  {
    displayName: 'Home Sweat Home',
    cityInTimeZone: 'America/New_York',
    customCityName: 'My Happy City',
    timeZone: '(UTC-05:00) Eastern Time (US & Canada)', // from `cityInTimeZone`
    countryCode: 'US', // from `cityInTimeZone`
    diffToBrowserTime: '+3HRS', // from `moment().tz(`cityInTimeZone`) - moment()`
  },
  {
    displayName: 'My Besty Home',
    cityInTimeZone: 'Asia/Hong_Kong',
    timeZone: '(UTC+08:00) Hong Kong Standard Time',
    countryCode: 'CN',
    diffToBrowserTime: '+15HRS',
  },
  {
    displayName: 'Favorite Vacation',
    cityInTimeZone: 'Asia/Tokyo',
    timeZone: '(UTC+09:00) Japan Standard Time',
    countryCode: 'JP',
    diffToBrowserTime: '+19HRS',
  },
];

class UnconnectedTimeManagement extends Component {
  static propTypes = {
    isLoadingData: PropTypes.bool.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    formSearch: PropTypes.string.isRequired,
    formSortBy: PropTypes.string,
    formShowNearbyTimeZonesOnly: PropTypes.bool.isRequired,
    formShowCurrentTimeZoneOnly: PropTypes.bool.isRequired,
    myTimeZones: PropTypes.arrayOf(
      PropTypes.shape({
        displayName: PropTypes.string.isRequired,
        cityInTimeZone: PropTypes.string.isRequired,
        customCityName: PropTypes.string,
      })
    ).isRequired,

    dispatchSetFormField: PropTypes.func.isRequired,
    dispatchInitialize: PropTypes.func.isRequired,

    history: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  };

  static defaultProps = {
    formSortBy: undefined,
  };

  async componentDidMount() {
    try {
      await this.props.dispatchInitialize();
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
      isLoadingData,
      isAuthenticated,
      formSearch,
      formSortBy,
      formShowNearbyTimeZonesOnly,
      formShowCurrentTimeZoneOnly,
    } = this.props;

    if (!isAuthenticated) {
      return null;
    }

    const timeZones = data
      .map(t => t)
      .filter(timeZone => {
        let willBeIncluded = true;

        if (formSearch) {
          const searchAgainst = `${timeZone.displayName} ${
            timeZone.cityInTimeZone
          } ${timeZone.customCityName || ''} ${timeZone.timeZone} ${
            timeZone.diffToBrowserTime
          }`.toLowerCase();

          if (searchAgainst.includes(formSearch.toLowerCase())) {
            willBeIncluded = true;
          } else {
            willBeIncluded = false;
          }
        }

        if (willBeIncluded && (formShowNearbyTimeZonesOnly || formShowCurrentTimeZoneOnly)) {
          willBeIncluded = false;

          if (formShowNearbyTimeZonesOnly && 1 === 2) {
            // TODO: Use `diffToBrowserTime`
            willBeIncluded = true;
          }

          if (formShowCurrentTimeZoneOnly && 1 === 3) {
            // TODO: Use `diffToBrowserTime`
            willBeIncluded = true;
          }
        }

        return willBeIncluded;
      })
      .sort((first, second) => {
        if (formSortBy) {
          if (formSortBy === timeZonesSortBy.name) {
            return first.displayName.localeCompare(second.displayName);
          }

          if (formSortBy === timeZonesSortBy.city) {
            return first.cityInTimeZone.localeCompare(second.cityInTimeZone);
          }

          if (formSortBy === timeZonesSortBy.differenceWithGmt) {
            return first.name.localeCompare(second.name); // TODO
          }
        }
        return first.dateCreated - second.dateCreated;
      });

    return (
      <div className="time-management">
        <main>
          <div className="white-board">
            <div className="main-header">
              <h4>Manage Time Zones</h4>
              <Button type="button" onClick={() => {}}>
                Add
              </Button>
            </div>
            <div className="panes">
              <section className="pane control">
                <Select
                  className="sort-by-select"
                  allowClear={true}
                  onChange={this.handleInputChange.bind(this, 'sortBy')}
                  placeholder="Sort by"
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
                  placeholder="Search users"
                />
                <CheckboxInput
                  onChange={this.handleInputChange.bind(this, 'showNearbyTimeZonesOnly')}
                  value={formShowNearbyTimeZonesOnly}
                >
                  Show nearby time zones
                </CheckboxInput>
                <CheckboxInput
                  onChange={this.handleInputChange.bind(this, 'showCurrentTimeZoneOnly')}
                  value={formShowCurrentTimeZoneOnly}
                >
                  Show current time zone only
                </CheckboxInput>
              </section>

              <section className="pane">
                <List
                  className="time-zone-or-user-list"
                  loading={isLoadingData}
                  itemLayout="horizontal"
                  dataSource={timeZones}
                  renderItem={item => (
                    <List.Item
                      actions={[
                        <span key="list-edit" className="link">
                          Edit
                        </span>,
                        <span key="list-delete" className="link">
                          Delete
                        </span>,
                      ]}
                    >
                      <Skeleton loading={false} avatar={true} title={false} active={true}>
                        <List.Item.Meta
                          avatar={(
                            <ReactCountryFlag
                              countryCode={item.countryCode}
                              svg={true}
                              className="flag-icon"
                            />
                          )}
                          title={`${item.displayName} (${item.customCityName ||
                            item.cityInTimeZone})`}
                          description={`${format(new Date(), 'hh:mm aaaa')} (${
                            item.diffToBrowserTime
                          })`}
                        />
                        <div className="extra-info">{item.timeZone}</div>
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

const mapStateToProps = state => ({
  isLoadingData: state.timeManagement.loadData.isLoadingData,
  isAuthenticated: state.me.main.isAuthenticated,
  formSearch: state.timeManagement.form.search.value,
  formSortBy: state.timeManagement.form.sortBy.value,
  formShowNearbyTimeZonesOnly: state.timeManagement.form.showNearbyTimeZonesOnly.value,
  formShowCurrentTimeZoneOnly: state.timeManagement.form.showCurrentTimeZoneOnly.value,
  myTimeZones: state.timeManagement.main.myTimeZones,
});

function mapDispatchToProps(dispatch) {
  return {
    dispatchInitialize(id) {
      return dispatch(actionCreator.initialize(id));
    },

    dispatchSetFormField(field, value) {
      dispatch(actionCreator.setFormField(field, value));
    },
  };
}

const TimeManagement = connect(
  mapStateToProps,
  mapDispatchToProps
)(UnconnectedTimeManagement);

export { UnconnectedTimeManagement, TimeManagement as default };
