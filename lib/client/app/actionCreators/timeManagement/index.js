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

  initialize() {
    return async dispatch => {
      await dispatch(meActionCreator.checkAuthentication());

      //await dispatch(this.fetchMyTimeZones());
    };
  },

  fetchMyTimeZones() {
    return async dispatch => {
      try {
        dispatch(this.loadDataRequest());

        const { data: myTimeZones } = await datasource.fetchMyTimeZones();

        dispatch(this.setData({ myTimeZones }));

        dispatch(this.loadDataSuccess());
      } catch (error) {
        showModal(error.message, 'error');

        dispatch(this.loadDataFailure(error.message));

        throw error;
      }
    };
  },
};
