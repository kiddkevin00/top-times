import buildFormReducer from './builders/form';
import buildUpdateDataReducer from './builders/updateData';
import actionTypes, { namespaces } from '../actionTypes';
import { combineReducers } from 'redux';

const { LOGIN } = actionTypes;

const mainInitialState = {};
const formInitialState = {
  identifier: {
    value: '',
  },
  password: {
    value: '',
  },
};
const updateDataInitialState = {
  isUpdatingData: false,
  error: {
    isVisible: false,
    message: '',
  },
};

const mainReducer = (state = mainInitialState, action) => {
  const actionType = action.type;
  // const actionPayload = action.payload;

  switch (actionType) {
    case LOGIN.RESET_STATE:
      return { ...mainInitialState };
    default:
      return state;
  }
};

const loginReducer = combineReducers({
  main: mainReducer,
  form: buildFormReducer(formInitialState, namespaces.LOGIN),
  updateData: buildUpdateDataReducer(updateDataInitialState, namespaces.LOGIN),
});

export { loginReducer as default };
