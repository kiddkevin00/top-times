import createAccount from './createAccount';
import login from './login';
import forgotPassword from './forgotPassword';
import timeManagement from './timeManagement';
import userManagement from './userManagement';
import accountInfo from './accountInfo';
import me from './me';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  createAccount,
  login,
  forgotPassword,
  timeManagement,
  userManagement,
  accountInfo,
  me,
});

export { rootReducer as default };
