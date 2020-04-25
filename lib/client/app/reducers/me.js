import buildFormReducer from './builders/form';
import buildLoadDataReducer from './builders/loadData';
import buildUpdateDataReducer from './builders/updateData';
import actionTypes, { namespaces } from '../actionTypes';
import { combineReducers } from 'redux';

const { ME } = actionTypes;

const mainInitialState = {
  isAuthenticated: false,

  _id: undefined,
  email: undefined,
  fullName: undefined,
  timeZone: undefined,
  role: undefined,
  dob: undefined,
  termsAccepted: undefined,
  newsletterSubscribed: undefined,
  isSuspended: undefined,
};
const loadDataInitialState = {
  isLoadingData: false,
};
const formInitialState = {
  email: {
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

function mainReducer(state = mainInitialState, action) {
  const actionType = action.type;
  const actionPayload = action.payload;

  switch (actionType) {
    case ME.RESET_STATE:
      return { ...mainInitialState };
    case ME.SET_DATA:
      return {
        ...state,
        ...actionPayload,
      };
    default:
      return state;
  }
}

const meReducer = combineReducers({
  main: mainReducer,
  loadData: buildLoadDataReducer(loadDataInitialState, namespaces.ME),
  form: buildFormReducer(formInitialState, namespaces.ME),
  updateData: buildUpdateDataReducer(updateDataInitialState, namespaces.ME),
});

export { meReducer as default };
