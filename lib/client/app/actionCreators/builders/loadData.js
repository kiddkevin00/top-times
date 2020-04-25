import actionTypes from '../../actionTypes';

const { LOAD_DATA } = actionTypes;

export default name => ({
  resetLoadDataState() {
    return {
      type: LOAD_DATA.RESET_STATE,
      name,
    };
  },

  loadDataRequest() {
    return {
      type: LOAD_DATA.REQUEST,
      name,
    };
  },

  loadDataSuccess() {
    return {
      type: LOAD_DATA.SUCCESS,
      name,
    };
  },

  loadDataFailure() {
    return {
      type: LOAD_DATA.FAILURE,
      name,
    };
  },
});
