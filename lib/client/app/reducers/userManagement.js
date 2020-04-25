import buildFormReducer from './builders/form';
import buildLoadDataReducer from './builders/loadData';
import actionTypes, { namespaces } from '../actionTypes';
import { combineReducers } from 'redux';

const { USER_MANAGEMENT } = actionTypes;

const mainInitialState = {
  users: [],
};
const formInitialState = {
  search: {
    value: '',
  },
  sortBy: {
    value: undefined,
  },
  showManagersOnly: {
    value: false,
  },
  showAdminsOnly: {
    value: false,
  },
  showNewsletterSubscribersOnly: {
    value: false,
  },
};
const loadDataInitialState = {
  isLoadingData: false,
};

const mainReducer = (state = mainInitialState, action) => {
  const actionType = action.type;
  const actionPayload = action.payload;

  switch (actionType) {
    case USER_MANAGEMENT.RESET_STATE:
      return { ...mainInitialState };
    case USER_MANAGEMENT.SET_DATA:
      return {
        ...state,
        ...actionPayload,
      };
    default:
      return state;
  }
};

const userManagementReducer = combineReducers({
  main: mainReducer,
  form: buildFormReducer(formInitialState, namespaces.USER_MANAGEMENT),
  loadData: buildLoadDataReducer(loadDataInitialState, namespaces.USER_MANAGEMENT),
});

export { userManagementReducer as default };
