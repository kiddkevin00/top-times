import * as datasource from './datasource';
import buildFormActionCreator from '../builders/form';
import buildUpdateDataActionCreator from '../builders/updateData';
import meActionCreator from '../me';
import { showModal } from '../../utils/helpers';
import { jwtStorageKey } from '../../utils/constants';
import actionTypes, { namespaces } from '../../actionTypes';

const { CREATE_ACCOUNT } = actionTypes;

export default {
  ...buildFormActionCreator(namespaces.CREATE_ACCOUNT),
  ...buildUpdateDataActionCreator(namespaces.CREATE_ACCOUNT),

  resetMainState() {
    return {
      type: CREATE_ACCOUNT.RESET_STATE,
    };
  },

  resetState() {
    return dispatch => {
      dispatch(this.resetMainState());

      dispatch(this.resetFormState());

      dispatch(this.resetUpdateDataState());
    };
  },

  createAccount(history, redirectUrl, payload) {
    return async dispatch => {
      try {
        dispatch(this.updateDataRequest());

        const {
          data: { jwtToken, user },
        } = await datasource.signUp(payload);
        const isAuthenticated = true;

        dispatch(meActionCreator.setData({ isAuthenticated, ...user }));

        window.localStorage.setItem(jwtStorageKey, jwtToken);

        if (redirectUrl !== '/') {
          history.push(redirectUrl);
        } else {
          history.push('/manage-timezones');
        }

        dispatch(this.updateDataSuccess());
      } catch (error) {
        showModal(error.message, 'error');

        dispatch(this.updateDataFailure(error.message));
      }
    };
  },
};
