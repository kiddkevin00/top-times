import actionCreator from '../../../../lib/client/app/actionCreators/login';
import { login } from '../../../../lib/client/app/actionCreators/login/datasource';
import { showModal } from '../../../../lib/client/app/utils/helpers';
import actionTypes, { namespaces } from '../../../../lib/client/app/actionTypes';
import { jwtStorageKey } from '../../../../lib/client/app/utils/constants';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const { LOGIN, FORM, UPDATE_DATA, ME } = actionTypes;
const name = namespaces.LOGIN;

jest.mock('../../../../lib/client/app/actionCreators/login/datasource', () => ({
  login: jest.fn(),
}));

jest.mock('../../../../lib/client/app/utils/helpers', () => ({
  showModal: jest.fn(),
}));

describe('Login action creator', () => {
  it('dispatches an action to reset main state', () => {
    expect(actionCreator.resetMainState()).toEqual({
      type: LOGIN.RESET_STATE,
    });
  });

  it('dispatches 4 actions to reset the whole state', () => {
    const mockDispatch = jest.fn();
    const resetThunk = actionCreator.resetState();

    resetThunk(mockDispatch);

    expect(mockDispatch).toHaveBeenCalledTimes(3);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: LOGIN.RESET_STATE,
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

  describe('when dealing with async operation via thunk', () => {
    let store;

    beforeEach(() => {
      store = mockStore();
    });

    afterEach(() => {
      localStorage.clear();
    });

    describe('when logging in', () => {
      let history;
      let identifier;
      let password;
      let userData;
      const updateDataRequestAction = { type: UPDATE_DATA.REQUEST, name };

      beforeEach(() => {
        history = { push: jest.fn() };
        identifier = 'test123@user.com';
        password = 'P@ssw0rd123';
        userData = { email: 'marcus123@gmail.com', fullName: 'Marcus Test'};
      });

      it('should dispatch three actions on successful load', async () => {
        const jwtToken = 'a-jwt-token';
        const redirectUrl = '/some-where';

        login.mockResolvedValue({ data: { jwtToken, user: userData }});

        await store.dispatch(actionCreator.login(history, identifier, password, redirectUrl));

        expect(store.getActions()).toEqual([
          updateDataRequestAction,
          {
            type: ME.SET_DATA,
            payload: {
              ...userData,
              isAuthenticated: true,
            },
          },
          { type: UPDATE_DATA.SUCCESS, name },
        ]);

        expect(localStorage.setItem).toHaveBeenLastCalledWith(jwtStorageKey, jwtToken);
        expect(localStorage.setItem).toHaveBeenCalledTimes(1);
        expect(localStorage.__STORE__[jwtStorageKey]).toBe(jwtToken);
        expect(localStorage.__STORE__.length).toBe(1);
      });

      it('should dispatch two actions on failed load', async () => {
        const errorMsg = 'Something went wrong...';

        login.mockRejectedValue(new Error(errorMsg));

        await store.dispatch(actionCreator.login());

        expect(showModal).toHaveBeenLastCalledWith(errorMsg, 'error');
        expect(showModal).toHaveBeenCalledTimes(1);

        expect(store.getActions()).toEqual([
          updateDataRequestAction,
          { type: UPDATE_DATA.FAILURE, payload: errorMsg, name },
        ]);
      });
    });
  });
});
