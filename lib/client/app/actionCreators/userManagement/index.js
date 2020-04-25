import * as datasource from './datasource';
import { showModal } from '../../utils/helpers';
import meActionCreator from '../me';
import buildFormActionCreator from '../builders/form';
import buildLoadDataActionCreator from '../builders/loadData';
import buildUpdateDataActionCreator from '../builders/updateData';
import actionTypes, { namespaces } from '../../actionTypes';

const { USER_MANAGEMENT } = actionTypes;

export default {
  ...buildFormActionCreator(namespaces.USER_MANAGEMENT),
  ...buildLoadDataActionCreator(namespaces.USER_MANAGEMENT),
  ...buildUpdateDataActionCreator(namespaces.USER_MANAGEMENT),

  resetMainState() {
    return {
      type: USER_MANAGEMENT.RESET_STATE,
    };
  },

  resetState() {
    return dispatch => {
      dispatch(this.resetMainState());

      dispatch(this.resetFormState());

      dispatch(this.resetLoadDataState());
    };
  },

  setData(payload) {
    return {
      type: USER_MANAGEMENT.SET_DATA,
      payload,
    };
  },

  initialize() {
    return async dispatch => {
      await dispatch(meActionCreator.checkAuthentication());

      await dispatch(this.fetchUsers());
    };
  },

  fetchUsers() {
    return async dispatch => {
      try {
        dispatch(this.loadDataRequest());

        const { data: users } = await datasource.fetchUsers();

        dispatch(this.setData({ users }));

        dispatch(this.loadDataSuccess());
      } catch (error) {
        showModal(error.message, 'error');

        dispatch(this.loadDataFailure(error.message));

        throw error;
      }
    };
  },

  removeUser(id) {
    return async dispatch => {
      try {
        dispatch(this.loadDataRequest());

        await datasource.removeUser(id);
        await dispatch(this.fetchUsers());

        dispatch(this.loadDataSuccess());
      } catch (error) {
        showModal(error.message, 'error');

        dispatch(this.loadDataFailure(error.message));

        throw error;
      }
    };
  },
};
