import * as datasource from './datasource';
import { showModal } from '../../utils/helpers';
import meActionCreator from '../me';
import buildFormActionCreator from '../builders/form';
import buildLoadDataActionCreator from '../builders/loadData';
import buildUpdateDataActionCreator from '../builders/updateData';
import actionTypes, { namespaces } from '../../actionTypes';

const { TIME_MANAGEMENT } = actionTypes;

export default {
  ...buildFormActionCreator(namespaces.TIME_MANAGEMENT),
  ...buildLoadDataActionCreator(namespaces.TIME_MANAGEMENT),
  ...buildUpdateDataActionCreator(namespaces.TIME_MANAGEMENT),

  resetMainState() {
    return {
      type: TIME_MANAGEMENT.RESET_STATE,
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
      type: TIME_MANAGEMENT.SET_DATA,
      payload,
    };
  },

  initialize(userId) {
    return async dispatch => {
      await dispatch(meActionCreator.checkAuthentication());

      await dispatch(this.fetchTimeZones(userId));
    };
  },

  fetchTimeZones(userId) {
    return async dispatch => {
      try {
        dispatch(this.loadDataRequest());

        const { data: timeZones } = await datasource.fetchTimeZones(userId);

        dispatch(this.setData({ timeZones }));

        dispatch(this.loadDataSuccess());
      } catch (error) {
        showModal(error.message, 'error');

        dispatch(this.loadDataFailure(error.message));

        throw error;
      }
    };
  },

  removeTimeZone(timeZoneId, userId) {
    return async dispatch => {
      try {
        dispatch(this.loadDataRequest());

        await datasource.removeTimeZone(timeZoneId, userId);
        await dispatch(this.fetchTimeZones(userId));

        showModal('The timezone has been removed successfully!', 'success', 'Okay');

        dispatch(this.loadDataSuccess());
      } catch (error) {
        showModal(error.message, 'error');

        dispatch(this.loadDataFailure(error.message));

        throw error;
      }
    };
  },
};
