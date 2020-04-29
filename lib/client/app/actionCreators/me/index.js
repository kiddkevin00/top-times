import * as datasource from './datasource';
import { showModal } from '../../utils/helpers';
import buildLoadDataActionCreator from '../builders/loadData';
import buildFormActionCreator from '../builders/form';
import buildUpdateDataActionCreator from '../builders/updateData';
import actionTypes, { namespaces } from '../../actionTypes';
import { errorMessages, jwtStorageKey } from '../../utils/constants';

const { ME } = actionTypes;

const meActionCreator = {
  ...buildLoadDataActionCreator(namespaces.ME),
  ...buildFormActionCreator(namespaces.ME),
  ...buildUpdateDataActionCreator(namespaces.ME),

  resetMainState() {
    return {
      type: ME.RESET_STATE,
    };
  },

  resetState() {
    return dispatch => {
      dispatch(this.resetMainState());

      dispatch(this.resetLoadDataState());

      dispatch(this.resetFormState());

      dispatch(this.resetUpdateDataState());
    };
  },

  setData(payload) {
    return {
      type: ME.SET_DATA,
      payload,
    };
  },

  checkAuthentication() {
    return async dispatch => {
      try {
        dispatch(this.loadDataRequest());

        const {
          data: { jwtToken, user },
        } = await datasource.checkAuthentication();
        const isAuthenticated = true;

        dispatch(this.setData({ isAuthenticated, ...user }));

        window.localStorage.setItem(jwtStorageKey, jwtToken);

        dispatch(this.loadDataSuccess());

        return user;
      } catch (error) {
        dispatch(this.resetMainState());

        dispatch(this.loadDataFailure());

        throw new Error(errorMessages.unauthenticated);
      }
    };
  },

  logout(history) {
    return async dispatch => {
      try {
        dispatch(this.updateDataRequest());

        await datasource.logout();

        dispatch(this.setData({ isAuthenticated: false }));

        window.localStorage.removeItem(jwtStorageKey);

        history.push('/login');

        dispatch(this.updateDataSuccess());
      } catch (error) {
        showModal(error.message, 'error');

        dispatch(this.updateDataFailure(error.message));
      }
    };
  },
};

export default meActionCreator;
