import createAccount from './createAccount';
import login from './login';
import forgotPassword from './forgotPassword';
import timeManagement from './timeManagement';
import addOrEditTimeZone from './addOrEditTimeZone';
import userManagement from './userManagement';
import accountInfo from './accountInfo';
import me from './me';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  createAccount,
  login,
  forgotPassword,
  timeManagement,
  addOrEditTimeZone,
  userManagement,
  accountInfo,
  me,
});

export { rootReducer as default };
