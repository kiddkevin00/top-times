import PageHeader from './containers/PageHeader';
import Home from './containers/Home';
import Login from './containers/Login';
import CreateAccount from './containers/CreateAccount';
import ForgotPassword from './containers/ForgotPassword';
import TimeManagement from './containers/TimeManagement';
import UserManagement from './containers/UserManagement';
import AccountInfo from './containers/AccountInfo';
import createStore from './store';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { Provider } from 'react-redux';
import React from 'react';

const initialState = window.INITIAL_STATE;
const store = createStore(initialState);

const routes = (
  <Provider store={store}>
    <Router>
      <div>
        <PageHeader />

        <Switch>
          <Route exact={true} path="/home" component={Home} />
          <Route exact={true} path="/login" component={Login} />
          <Route exact={true} path="/create-account" component={CreateAccount} />
          <Route exact={true} path="/forgot-password" component={ForgotPassword} />
          <Route exact={true} path="/manage-timezones" component={TimeManagement} />
          <Route exact={true} path="/manage-timezones/:id" component={props => <TimeManagement {...props} />} />
          <Route exact={true} path="/manage-users" component={UserManagement} />
          <Route exact={true} path="/account-info" component={AccountInfo} />
          <Route exact={true} path="/account-info/:id" component={props => <AccountInfo {...props} />} />

          <Redirect from="/" to="/home" />
        </Switch>
      </div>
    </Router>
  </Provider>
);

export { routes as default };
