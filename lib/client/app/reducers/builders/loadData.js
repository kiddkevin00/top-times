import buildNamedWrapperReducer from './namedWrapper';
import actionTypes from '../../actionTypes';

const { LOAD_DATA } = actionTypes;

export default (initialState, name) => {
  const loadDataReducer = (state = initialState, action) => {
    const actionType = action.type;

    switch (actionType) {
      case LOAD_DATA.RESET_STATE:
        return { ...initialState };
      case LOAD_DATA.REQUEST:
        return { ...state, isLoadingData: true };
      case LOAD_DATA.SUCCESS:
      case LOAD_DATA.FAILURE:
        return { ...state, isLoadingData: false };
      default:
        return state;
    }
  };

  return buildNamedWrapperReducer(loadDataReducer, name);
};
