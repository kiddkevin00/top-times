import buildActionCreator from '../../../../lib/client/app/actionCreators/builders/loadData';
import actionTypes from '../../../../lib/client/app/actionTypes';

describe('Builder for loadData action creator ', () => {
  const name = 'TESTING';
  let actionCreator;

  beforeEach(() => {
    actionCreator = buildActionCreator(name);
  });

  it('creates an action to reset form state', () => {
    expect(actionCreator.resetLoadDataState()).toEqual({
      type: actionTypes.LOAD_DATA.RESET_STATE,
      name,
    });
  });

  it('creates an action to set isLoadingData flag', () => {
    expect(actionCreator.loadDataRequest()).toEqual({
      type: actionTypes.LOAD_DATA.REQUEST,
      name,
    });
  });

  it('creates an action to remove isLoadingData flag on success', () => {
    expect(actionCreator.loadDataSuccess()).toEqual({
      type: actionTypes.LOAD_DATA.SUCCESS,
      name,
    });
  });

  it('creates an action to remove isLoadingData flag on failure', () => {
    expect(actionCreator.loadDataFailure()).toEqual({
      type: actionTypes.LOAD_DATA.FAILURE,
      name,
    });
  });
});
