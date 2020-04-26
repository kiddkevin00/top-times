import * as datasource from './datasource';
import buildFormActionCreator from '../builders/form';
import buildLoadDataActionCreator from '../builders/loadData';
import buildUpdateDataActionCreator from '../builders/updateData';
import { showModal } from '../../utils/helpers';
import actionTypes, { namespaces } from '../../actionTypes';
import meActionCreator from '../me';

const { ADD_OR_EDIT_TIME_ZONE } = actionTypes;

export default {
  ...buildFormActionCreator(namespaces.ADD_OR_EDIT_TIME_ZONE),
  ...buildLoadDataActionCreator(namespaces.ADD_OR_EDIT_TIME_ZONE),
  ...buildUpdateDataActionCreator(namespaces.ADD_OR_EDIT_TIME_ZONE),

  resetMainState() {
    return {
      type: ADD_OR_EDIT_TIME_ZONE.RESET_STATE,
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
      type: ADD_OR_EDIT_TIME_ZONE.SET_DATA,
      payload,
    };
  },

  initialize(timeZoneId, userId) {
    return async dispatch => {
      await dispatch(meActionCreator.checkAuthentication());

      if (timeZoneId) {
        await dispatch(this.fetchTimeZoneInfo(timeZoneId, userId));
      }
    };
  },

  fetchTimeZoneInfo(timeZoneId, userId) {
    return async dispatch => {
      try {
        dispatch(this.loadDataRequest());

        const {
          data: [timeZone],
        } = await datasource.fetchTimeZoneInfo(timeZoneId, userId);

        dispatch(this.setData({ ...timeZone }));

        dispatch(this.loadDataSuccess());
      } catch (error) {
        dispatch(this.resetMainState());
        showModal(error.message, 'error');

        dispatch(this.loadDataFailure(error.message));

        throw error;
      }
    };
  },

  addOrEditTimeZone(payload, history, timeZoneId, userId) {
    return async dispatch => {
      try {
        dispatch(this.updateDataRequest());

        if (timeZoneId) {
          await datasource.updateTimeZone(payload, timeZoneId, userId);

          showModal('The timezone information has been updated successfully!', 'success', 'Okay');
        } else {
          await datasource.addTimeZone(payload, userId);

          showModal('The timezone has been added successfully!', 'success', 'Okay');
        }

        history.goBack();

        dispatch(this.updateDataSuccess());
      } catch (error) {
        showModal(error.message, 'error');

        dispatch(this.updateDataFailure(error.message));
      }
    };
  },
};
