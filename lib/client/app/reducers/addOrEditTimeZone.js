import buildFormReducer from './builders/form';
import buildLoadDataReducer from './builders/loadData';
import buildUpdateDataReducer from './builders/updateData';
import actionTypes, { namespaces } from '../actionTypes';
import { combineReducers } from 'redux';

const { ADD_OR_EDIT_TIME_ZONE } = actionTypes;

const mainInitialState = {
  displayName: '',
  cityInTimeZone: undefined,
  customCityName: '',
  notes: '',
};
const formInitialState = {
  displayName: {
    value: '',
  },
  cityInTimeZone: {
    value: undefined,
  },
  customCityName: {
    value: '',
  },
  notes: {
    value: '',
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
    case ADD_OR_EDIT_TIME_ZONE.RESET_STATE:
      return { ...mainInitialState };
    case ADD_OR_EDIT_TIME_ZONE.SET_DATA:
      return {
        ...state,
        ...actionPayload,
      };
    default:
      return state;
  }
};

const addOrEditTimeZoneReducer = combineReducers({
  main: mainReducer,
  form: buildFormReducer(formInitialState, namespaces.ADD_OR_EDIT_TIME_ZONE),
  loadData: buildLoadDataReducer(loadDataInitialState, namespaces.ADD_OR_EDIT_TIME_ZONE),
  updateData: buildUpdateDataReducer(updateDataInitialState, namespaces.ADD_OR_EDIT_TIME_ZONE),
});

export { addOrEditTimeZoneReducer as default };
