import buildFormReducer from './builders/form';
import buildUpdateDataReducer from './builders/updateData';
import buildLoadDataReducer from './builders/loadData';
import actionTypes, { namespaces } from '../actionTypes';
import { nullValueInTimeZoneSelect } from '../components/TimeZoneSelect';
import { combineReducers } from 'redux';

const { ACCOUNT_INFO } = actionTypes;

const mainInitialState = {
  fullName: '',
  timeZone: '',
  role: undefined,
  dob: undefined,
  email: '',
  newsletterSubscribed: false,
};
const formInitialState = {
  fullName: {
    value: '',
  },
  timeZone: {
    value: nullValueInTimeZoneSelect,
  },
  role: {
    value: undefined,
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
  newsletterSubscribed: {
    value: false,
  },
};
const loadDataInitialState = {
  isLoadingData: false,
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
  const actionPayload = action.payload;

  switch (actionType) {
    case ACCOUNT_INFO.RESET_STATE:
      return { ...mainInitialState };
    case ACCOUNT_INFO.SET_DATA:
      return {
        ...state,
        ...actionPayload,
      };
    default:
      return state;
  }
};

const accountInfoReducer = combineReducers({
  main: mainReducer,
  form: buildFormReducer(formInitialState, namespaces.ACCOUNT_INFO),
  loadData: buildLoadDataReducer(loadDataInitialState, namespaces.ACCOUNT_INFO),
  updateData: buildUpdateDataReducer(updateDataInitialState, namespaces.ACCOUNT_INFO),
});

export { accountInfoReducer as default };
