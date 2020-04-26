import buildFormReducer from './builders/form';
import buildLoadDataReducer from './builders/loadData';
import actionTypes, { namespaces } from '../actionTypes';
import { combineReducers } from 'redux';

const { TIME_MANAGEMENT } = actionTypes;

const mainInitialState = {
  timeZones: [],
};
const formInitialState = {
  search: {
    value: '',
  },
  sortBy: {
    value: undefined,
  },
  showNearbyTimeZonesOnly: {
    value: false,
  },
  showCurrentTimeZoneOnly: {
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
    case TIME_MANAGEMENT.RESET_STATE:
      return { ...mainInitialState };
    case TIME_MANAGEMENT.SET_DATA:
      return {
        ...state,
        ...actionPayload,
      };
    default:
      return state;
  }
};

const timeManagementReducer = combineReducers({
  main: mainReducer,
  form: buildFormReducer(formInitialState, namespaces.TIME_MANAGEMENT),
  loadData: buildLoadDataReducer(loadDataInitialState, namespaces.TIME_MANAGEMENT),
});

export { timeManagementReducer as default };
