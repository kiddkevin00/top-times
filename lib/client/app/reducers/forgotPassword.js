import buildFormReducer from './builders/form';
import buildUpdateDataReducer from './builders/updateData';
import actionTypes, { namespaces } from '../actionTypes';
import { combineReducers } from 'redux';

const { FORGOT_PASSWORD } = actionTypes;

const mainInitialState = {};
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

const mainReducer = (state = mainInitialState, action) => {
  const actionType = action.type;
  // const actionPayload = action.payload;

  switch (actionType) {
    case FORGOT_PASSWORD.RESET_STATE:
      return { ...mainInitialState };
    default:
      return state;
  }
};

const forgotPasswordReducer = combineReducers({
  main: mainReducer,
  form: buildFormReducer(formInitialState, namespaces.FORGOT_PASSWORD),
  updateData: buildUpdateDataReducer(updateDataInitialState, namespaces.FORGOT_PASSWORD),
});

export { forgotPasswordReducer as default };
