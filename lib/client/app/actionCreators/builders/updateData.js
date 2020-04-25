import actionTypes from '../../actionTypes';

const { UPDATE_DATA } = actionTypes;

export default name => ({
  resetUpdateDataState() {
    return {
      type: UPDATE_DATA.RESET_STATE,
      name,
    };
  },

  updateDataRequest() {
    return {
      type: UPDATE_DATA.REQUEST,
      name,
    };
  },

  updateDataSuccess() {
    return {
      type: UPDATE_DATA.SUCCESS,
      name,
    };
  },

  updateDataFailure(errorMsg) {
    return {
      type: UPDATE_DATA.FAILURE,
      payload: errorMsg,
      name,
    };
  },
});
