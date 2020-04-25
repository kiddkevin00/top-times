import buildNamedWrapperReducer from './namedWrapper';
import actionTypes from '../../actionTypes';

const { UPDATE_DATA } = actionTypes;

export default (initialState, name) => {
  const updateDataReducer = (state = initialState, action) => {
    const actionType = action.type;
    const actionPayload = action.payload;

    switch (actionType) {
      case UPDATE_DATA.RESET_STATE:
        return { ...initialState };
      case UPDATE_DATA.REQUEST:
        return {
          ...initialState,
          isUpdatingData: true,
        };
      case UPDATE_DATA.SUCCESS:
        return {
          ...state,
          isUpdatingData: false,
        };
      case UPDATE_DATA.FAILURE:
        return {
          ...state,
          isUpdatingData: false,
          error: {
            isVisible: true,
            message: actionPayload,
          },
        };
      default:
        return state;
    }
  };

  return buildNamedWrapperReducer(updateDataReducer, name);
};
