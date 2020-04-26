import actionCreator from '../actionCreators/userManagement';
import CheckboxInput from '../components/CheckboxInput';
import Button from '../components/Button';
import { willRedirectBackFromLogin } from '../utils/helpers';
import { errorMessages, usersSortBy, roles } from '../utils/constants';
import { Select, List, Skeleton, Avatar, Icon } from 'antd';
import { format, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import '../../static/assets/styles/containers/userManagement.scss';

class UnconnectedUserManagement extends Component {
  static propTypes = {
    isLoadingData: PropTypes.bool.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    myRole: PropTypes.string,
    myUserId: PropTypes.string,
    formSearch: PropTypes.string.isRequired,
    formSortBy: PropTypes.string,
    formShowManagersOnly: PropTypes.bool.isRequired,
    formShowAdminsOnly: PropTypes.bool.isRequired,
    formShowNewsletterSubscribersOnly: PropTypes.bool.isRequired,
    users: PropTypes.arrayOf(
      PropTypes.shape({
        fullName: PropTypes.string.isRequired,
        timeZone: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired,
        dob: PropTypes.string,
        email: PropTypes.string.isRequired,
        newsletterSubscribed: PropTypes.bool.isRequired,
        dateCreated: PropTypes.string.isRequired,
      })
    ).isRequired,

    dispatchSetFormField: PropTypes.func.isRequired,
    dispatchInitialize: PropTypes.func.isRequired,
    dispatchRemoveUser: PropTypes.func.isRequired,

    history: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  };

  static defaultProps = {
    myRole: undefined,
    myUserId: undefined,
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
      myRole,
      myUserId,
      formSearch,
      formSortBy,
      formShowManagersOnly,
      formShowAdminsOnly,
      formShowNewsletterSubscribersOnly,
      users,
    } = this.props;

    if (!isAuthenticated) {
      return null;
    }

    if (myRole !== roles.manager && myRole !== roles.admin) {
      return null;
    }

    const usersDataSource = users
      .filter(user => {
        let willBeIncluded = true;

        if (formSearch) {
          const searchAgainst = `${user.fullName} ${user.timeZone} ${user.role} ${
            user.email
          } ${format(parseISO(user.dateCreated), 'M/d/yyyy')}`.toLowerCase();

          if (searchAgainst.includes(formSearch.toLowerCase())) {
            willBeIncluded = true;
          } else {
            willBeIncluded = false;
          }
        }

        if (
          willBeIncluded &&
          (formShowManagersOnly || formShowAdminsOnly || formShowNewsletterSubscribersOnly)
        ) {
          willBeIncluded = false;

          if (formShowManagersOnly && user.role === roles.manager) {
            willBeIncluded = true;
          }

          if (formShowAdminsOnly && user.role === roles.admin) {
            willBeIncluded = true;
          }

          if (formShowNewsletterSubscribersOnly && user.newsletterSubscribed) {
            willBeIncluded = true;
          }
        }

        if (myUserId === user._id) {
          willBeIncluded = false;
        }

        return willBeIncluded;
      })
      .sort((first, second) => {
        if (formSortBy) {
          if (formSortBy === usersSortBy.name) {
            return first.fullName.toLowerCase().localeCompare(second.fullName.toLowerCase());
          }

          if (formSortBy === usersSortBy.role) {
            return first.role.toLowerCase().localeCompare(second.role.toLowerCase());
          }

          if (formSortBy === usersSortBy.timeZone) {
            return first.timeZone.toLowerCase().localeCompare(second.timeZone.toLowerCase());
          }
        }
        return first.dateCreated - second.dateCreated;
      });

    return (
      <div className="user-management">
        <main>
          <div className="white-board">
            <div className="main-header">
              <h4>Manage Users</h4>
              <Button
                type="button"
                onClick={() => this.props.history.push('/create-account?isManagingUser=true')}
              >
                <Icon type="user-add" className="user-add" />
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
                  <Select.Option value={usersSortBy.name}>{usersSortBy.name}</Select.Option>
                  <Select.Option value={usersSortBy.role}>{usersSortBy.role}</Select.Option>
                  <Select.Option value={usersSortBy.timeZone}>{usersSortBy.timeZone}</Select.Option>
                </Select>

                <input
                  className="search-input"
                  value={formSearch}
                  onChange={this.handleInputChange.bind(this, 'search')}
                  placeholder="Search users"
                />
                <CheckboxInput
                  onChange={this.handleInputChange.bind(this, 'showManagersOnly')}
                  value={formShowManagersOnly}
                >
                  Show managers only
                </CheckboxInput>
                <CheckboxInput
                  onChange={this.handleInputChange.bind(this, 'showAdminsOnly')}
                  value={formShowAdminsOnly}
                >
                  Show admins only
                </CheckboxInput>
                <CheckboxInput
                  onChange={this.handleInputChange.bind(this, 'showNewsletterSubscribersOnly')}
                  value={formShowNewsletterSubscribersOnly}
                >
                  Show newsletter subscribers only
                </CheckboxInput>
              </section>

              <section className="pane">
                <List
                  className="time-zone-or-user-list"
                  loading={isLoadingData}
                  itemLayout="horizontal"
                  dataSource={usersDataSource}
                  renderItem={item => {
                    let icon;

                    switch (item.role) {
                      case roles.member:
                        icon = 'user';
                        break;
                      case roles.manager:
                        icon = 'setting';
                        break;
                      case roles.admin:
                      default:
                        icon = 'key';
                    }

                    return (
                      <List.Item
                        actions={[
                          myRole === roles.admin && (
                            <Link key="list-manage-time-zone" to={`/manage-timezones/${item._id}`}>
                              Manage Timezones
                            </Link>
                          ),
                          <Link key="list-edit" to={`/account-info/${item._id}`}>
                            Edit
                          </Link>,
                          <span
                            key="list-delete"
                            className="link"
                            onClick={() => this.props.dispatchRemoveUser(item._id)}
                          >
                            Delete
                          </span>,
                        ]}
                      >
                        <Skeleton loading={false} avatar={true} title={false} active={true}>
                          <List.Item.Meta
                            avatar={(
                              <Avatar
                                icon={icon}
                                shape="square"
                                size="large"
                                className="role-icon"
                              />
                            )}
                            title={`${item.fullName} (${item.email})`}
                            description={item.timeZone}
                          />
                          <div className="extra-info">{item.role} since {format(parseISO(item.dateCreated), 'M/d/yyyy')}</div>
                        </Skeleton>
                      </List.Item>
                    );
                  }}
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
  isLoadingData: state.userManagement.loadData.isLoadingData,
  isAuthenticated: state.me.main.isAuthenticated,
  myRole: state.me.main.role,
  myUserId: state.me.main._id,
  users: state.userManagement.main.users,
  formSearch: state.userManagement.form.search.value,
  formSortBy: state.userManagement.form.sortBy.value,
  formShowManagersOnly: state.userManagement.form.showManagersOnly.value,
  formShowAdminsOnly: state.userManagement.form.showAdminsOnly.value,
  formShowNewsletterSubscribersOnly: state.userManagement.form.showNewsletterSubscribersOnly.value,
});

function mapDispatchToProps(dispatch) {
  return {
    dispatchSetFormField(field, value) {
      dispatch(actionCreator.setFormField(field, value));
    },

    dispatchInitialize(id) {
      return dispatch(actionCreator.initialize(id));
    },

    dispatchRemoveUser(id) {
      dispatch(actionCreator.removeUser(id));
    },
  };
}

const UserManagement = connect(
  mapStateToProps,
  mapDispatchToProps
)(UnconnectedUserManagement);

export { UnconnectedUserManagement, UserManagement as default };
