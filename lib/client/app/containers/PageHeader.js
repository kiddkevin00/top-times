import meActionCreator from '../actionCreators/me';
import { roles } from '../utils/constants';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { LinkContainer } from 'react-router-bootstrap';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import '../../static/assets/styles/containers/pageHeader.scss';

class UnconnectedPageHeader extends Component {
  static propTypes = {
    isLoadingData: PropTypes.bool.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    fullName: PropTypes.string,
    role: PropTypes.string,

    dispatchCheckAuthentication: PropTypes.func.isRequired,
    dispatchLogout: PropTypes.func.isRequired,

    history: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  };

  static defaultProps = {
    fullName: '',
  };

  async componentDidMount() {
    try {
      await this.props.dispatchCheckAuthentication();
    } catch (e) {}
  }

  handleLogout = () => {
    this.props.dispatchLogout(this.props.history);
  };

  render() {
    const { isLoadingData, isAuthenticated, fullName, role } = this.props;
    const tabs = !isAuthenticated
      ? [
        <LinkContainer key="home-1" active={false} to="/home">
          <Nav.Link className="first-nav-link">HOME</Nav.Link>
        </LinkContainer>,
        <LinkContainer key="create-account" active={false} to="/create-account">
          <Nav.Link>SIGNUP</Nav.Link>
        </LinkContainer>,
        <LinkContainer key="login" active={false} to="/login">
          <Nav.Link>LOGIN</Nav.Link>
        </LinkContainer>,
      ] : [
        <LinkContainer key="my-time-zones" active={false} to="/manage-timezones">
          <Nav.Link className="first-nav-link">My Timezones</Nav.Link>
        </LinkContainer>,
        (role === roles.manager || role === roles.admin) ? (
          <LinkContainer key="manage-user" active={false} to="/manage-users">
            <Nav.Link>Manage Users</Nav.Link>
          </LinkContainer>
        ) : null,
        <NavDropdown
          key="account"
          title={`${fullName} `}
          alignRight={true}
        >
          <LinkContainer active={false} to="/account-info" exact={true}>
            <NavDropdown.Item>Profile</NavDropdown.Item>
          </LinkContainer>
          <NavDropdown.Divider />
          <NavDropdown.Item onSelect={this.handleLogout}>logout</NavDropdown.Item>
        </NavDropdown>,
      ];

    return (
      <Navbar
        fixed="top"
        variant="light"
        bg="white"
        expand="lg"
        collapseOnSelect={true}
        className="pn-page-header"
      >
        <Navbar.Brand>
          <LinkContainer to="/home">
            <img src="/images/timezone-calculator.jpeg" alt="logo" />
          </LinkContainer>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="pn-navbar-toggle" />
        <Navbar.Collapse id="pn-navbar-toggle" className="justify-content-end">
          <Nav>{isLoadingData ? null : tabs}</Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

const mapStateToProps = state => ({
  isLoadingData: state.me.loadData.isLoadingData,
  isAuthenticated: state.me.main.isAuthenticated,
  fullName: state.me.main.fullName,
  role: state.me.main.role,
});

const mapDispatchToProps = dispatch => ({
  dispatchCheckAuthentication() {
    return dispatch(meActionCreator.checkAuthentication());
  },

  dispatchLogout(history) {
    dispatch(meActionCreator.logout(history));
  },
});

const PageHeader = connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(UnconnectedPageHeader));

export { UnconnectedPageHeader, PageHeader as default };
