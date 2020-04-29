import actionCreator from '../../../../lib/client/app/actionCreators/me';
import { checkAuthentication, logout } from '../../../../lib/client/app/actionCreators/me/datasource';
import { showModal } from '../../../../lib/client/app/utils/helpers';
import actionTypes, { namespaces } from '../../../../lib/client/app/actionTypes';
import { errorMessages, jwtStorageKey } from '../../../../lib/client/app/utils/constants';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const { ME, LOAD_DATA, FORM, UPDATE_DATA } = actionTypes;
const name = namespaces.ME;

jest.mock('../../../../lib/client/app/actionCreators/me/datasource', () => ({
  checkAuthentication: jest.fn(),
  logout: jest.fn(),
}));

jest.mock('../../../../lib/client/app/utils/helpers', () => ({
  redirectTo: jest.fn(),
  showModal: jest.fn(),
}));

describe('Me action creator', () => {
  it('dispatches an action to reset main state', () => {
    expect(actionCreator.resetMainState()).toEqual({
      type: ME.RESET_STATE,
    });
  });

  it('dispatches 4 actions to reset the whole state', () => {
    const mockDispatch = jest.fn();
    const resetThunk = actionCreator.resetState();

    resetThunk(mockDispatch);

    expect(mockDispatch).toHaveBeenCalledTimes(4);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: ME.RESET_STATE,
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: LOAD_DATA.RESET_STATE,
      name,
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: FORM.RESET_STATE,
      name,
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: UPDATE_DATA.RESET_STATE,
      name,
    });
  });

  it('dispatch an action to set data', () => {
    const payload = {
      firstName: 'John',
      lastName: 'Doe',
    };

    expect(actionCreator.setData(payload)).toEqual({
      type: ME.SET_DATA,
      payload,
    });
  });

  describe('when dealing with async operation via thunk', () => {
    let store;

    beforeEach(() => {
      store = mockStore();
    });

    afterEach(() => {
      localStorage.clear();
    });

    describe('when checking authentication', () => {
      let userData;
      let jwtToken;
      const loadDataRequestAction = { type: LOAD_DATA.REQUEST, name };

      beforeEach(() => {
        userData = { email: 'marcus123@gmail.com', fullName: 'Marcus Test'};
        jwtToken = 'a-jwt-token';
      });

      it('should dispatch three actions on successful load', async () => {
        checkAuthentication.mockResolvedValue({ data: { user: userData, jwtToken } });

        const user = await store.dispatch(actionCreator.checkAuthentication());

        expect(user).toEqual(userData);

        expect(store.getActions()).toEqual([
          loadDataRequestAction,
          {
            type: ME.SET_DATA,
            payload: {
              ...userData,
              isAuthenticated: true,
            },
          },
          { type: LOAD_DATA.SUCCESS, name },
        ]);

        expect(localStorage.setItem).toHaveBeenLastCalledWith(jwtStorageKey, jwtToken);
        expect(localStorage.setItem).toHaveBeenCalledTimes(1);
        expect(localStorage.__STORE__[jwtStorageKey]).toBe(jwtToken);
        expect(localStorage.__STORE__.length).toBe(1);
      });

      it('should dispatch three actions on failed load', async () => {
        checkAuthentication.mockRejectedValue();

        try {
          await store.dispatch(actionCreator.checkAuthentication());
        } catch (err) {
          expect(err.message).toEqual(errorMessages.unauthenticated);

          expect(store.getActions()).toEqual([
            loadDataRequestAction,
            { type: ME.RESET_STATE },
            { type: LOAD_DATA.FAILURE, name },
          ]);
        }
      });
    });

    describe('when logging out', () => {
      let mockHistory;
      const updateDataRequestAction = { type: UPDATE_DATA.REQUEST, name };

      beforeEach(() => {
        mockHistory = { push: jest.fn() };
      });

      it('should dispatch three actions on successful update', async () => {
        logout.mockResolvedValue();

        await store.dispatch(actionCreator.logout(mockHistory));

        expect(store.getActions()).toEqual([
          updateDataRequestAction,
          {
            type: ME.SET_DATA,
            payload: {
              isAuthenticated: false,
            },
          },
          { type: UPDATE_DATA.SUCCESS, name },
        ]);

        expect(localStorage.removeItem).toHaveBeenLastCalledWith(jwtStorageKey);
        expect(localStorage.removeItem).toHaveBeenCalledTimes(1);

        expect(localStorage.__STORE__[jwtStorageKey]).toBeUndefined();
        expect(localStorage.__STORE__.length).toBe(0);

        expect(mockHistory.push).toHaveBeenLastCalledWith('/login');
        expect(mockHistory.push).toHaveBeenCalledTimes(1);
      });

      it('should dispatch three actions on failed update', async () => {
        const errorMsg = 'Something went wrong...';

        logout.mockRejectedValue(new Error(errorMsg));

        await store.dispatch(actionCreator.logout(mockHistory));

        expect(store.getActions()).toEqual([
          updateDataRequestAction,
          { type: UPDATE_DATA.FAILURE, payload: errorMsg, name },
        ]);

        expect(showModal).toHaveBeenLastCalledWith(errorMsg, 'error');
        expect(showModal).toHaveBeenCalledTimes(1);
      });
    });
  });
});
