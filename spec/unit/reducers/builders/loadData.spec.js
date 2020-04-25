import buildReducer from '../../../../lib/client/app/reducers/builders/loadData';
import actionTypes from '../../../../lib/client/app/actionTypes';

describe('Builder for loadData reducer', () => {
  const name = 'TESTING';
  let initialState;
  let reducer;

  beforeEach(() => {
    initialState = {
      isLoadingData: false,
    };

    reducer = buildReducer(initialState, name);
  });

  it('initializes with initial state', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('sets the isLoadingData flag on request', () => {
    expect(reducer({ ...initialState }, { type: actionTypes.LOAD_DATA.REQUEST, name })).toEqual({
      ...initialState,
      isLoadingData: true,
    });
  });

  it('resets the isLoadingData flag on success', () => {
    expect(reducer({ ...initialState }, { type: actionTypes.LOAD_DATA.SUCCESS, name })).toEqual({
      ...initialState,
      isLoadingData: false,
    });
  });

  it('resets the isLoadingData flag on failure', () => {
    expect(reducer({ ...initialState }, { type: actionTypes.LOAD_DATA.FAILURE, name })).toEqual({
      ...initialState,
      isLoadingData: false,
    });
  });

  it('resets to the initial state', () => {
    expect(reducer({}, { type: actionTypes.LOAD_DATA.RESET_STATE, name })).toEqual(initialState);
  });
});
