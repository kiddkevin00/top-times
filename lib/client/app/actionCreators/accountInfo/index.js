import * as datasource from './datasource';
import buildFormActionCreator from '../builders/form';
import buildloadDataActionCreator from '../builders/loadData';
import buildUpdateDataActionCreator from '../builders/updateData';
import meActionCreator from '../me';
import { showModal } from '../../utils/helpers';
import actionTypes, { namespaces } from '../../actionTypes';

const { ACCOUNT_INFO } = actionTypes;

export default {
  ...buildFormActionCreator(namespaces.ACCOUNT_INFO),
  ...buildloadDataActionCreator(namespaces.ACCOUNT_INFO),
  ...buildUpdateDataActionCreator(namespaces.ACCOUNT_INFO),

  resetMainState() {
    return {
      type: ACCOUNT_INFO.RESET_STATE,
    };
  },

  resetState() {
    return dispatch => {
      dispatch(this.resetMainState());

      dispatch(this.resetFormState());

      dispatch(this.resetUpdateDataState());
    };
  },

  setData(payload) {
    return {
      type: ACCOUNT_INFO.SET_DATA,
      payload,
    };
  },

  initialize(id) {
    return async (dispatch, getState) => {
      await dispatch(meActionCreator.checkAuthentication());

      if (id) {
        await dispatch(this.fetchUserProfile(id));
      } else {
        dispatch(this.setData({ ...getState().me.main }));
      }
    };
  },

  fetchUserProfile(id) {
    return async dispatch => {
      try {
        dispatch(this.loadDataRequest());

        const {
          data: [user],
        } = await datasource.fetchUserProfile(id);

        dispatch(this.setData({ ...user }));

        dispatch(this.loadDataSuccess());
      } catch (error) {
        dispatch(this.resetMainState());
        showModal(error.message, 'error');

        dispatch(this.loadDataFailure(error.message));

        throw error;
      }
    };
  },

  updateUserProfile(payload, id, history) {
    return async dispatch => {
      try {
        dispatch(this.updateDataRequest());

        const {
          data: { user },
        } = await datasource.updateUserProfile(payload, id);

        dispatch(meActionCreator.setData({ ...user }));

        showModal('Your profile has been updated successfully!', 'success', 'Okay');

        if (id) {
          history.goBack();
        }

        dispatch(this.updateDataSuccess());
      } catch (error) {
        showModal(error.message, 'error');

        dispatch(this.updateDataFailure(error.message));
      }
    };
  },
};
