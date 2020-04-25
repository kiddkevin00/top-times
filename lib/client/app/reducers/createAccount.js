import buildFormReducer from './builders/form';
import buildUpdateDataReducer from './builders/updateData';
import actionTypes, { namespaces } from '../actionTypes';
import { roles } from '../utils/constants';
import { combineReducers } from 'redux';

const { CREATE_ACCOUNT } = actionTypes;

const mainInitialState = {};
const formInitialState = {
  fullName: {
    value: '',
  },
  timeZone: {
    value: '',
  },
  role: {
    value: roles.member,
  },
  dob: {
    value: undefined,
  },
  email: {
    value: '',
  },
  password: {
    value: '',
  },
  termsAccepted: {
    value: false,
  },
  newsletterSubscribed: {
    value: true,
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
    case CREATE_ACCOUNT.RESET_STATE:
      return { ...mainInitialState };
    default:
      return state;
  }
};

const createAccountReducer = combineReducers({
  main: mainReducer,
  form: buildFormReducer(formInitialState, namespaces.CREATE_ACCOUNT),
  updateData: buildUpdateDataReducer(updateDataInitialState, namespaces.CREATE_ACCOUNT),
});

export { createAccountReducer as default };
