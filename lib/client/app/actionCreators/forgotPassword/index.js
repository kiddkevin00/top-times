import buildFormActionCreator from '../builders/form';
import buildUpdateDataActionCreator from '../builders/updateData';
import actionTypes, { namespaces } from '../../actionTypes';

const { FORGOT_PASSWORD } = actionTypes;

export default {
  ...buildFormActionCreator(namespaces.FORGOT_PASSWORD),
  ...buildUpdateDataActionCreator(namespaces.FORGOT_PASSWORD),

  resetMainState() {
    return {
      type: FORGOT_PASSWORD.RESET_STATE,
    };
  },

  resetState() {
    return dispatch => {
      dispatch(this.resetMainState());

      dispatch(this.resetFormState());

      dispatch(this.resetUpdateDataState());
    };
  },
};
