import buildNamedWrapperReducer from '../../../../lib/client/app/reducers/builders/namedWrapper';

describe('Builder for name wrapping a reducer', () => {
  const name = 'TESTING';
  let initialState;
  let reducer;
  let wrappedReducer;

  beforeEach(() => {
    initialState = {
      value: 1,
    };

    reducer = (state = initialState, action) => {
      switch (action.type) {
        case 'ACTION_ONE':
          return {
            ...state,
            value: 22,
          };
        default:
          return { ...state };
      }
    };

    wrappedReducer = buildNamedWrapperReducer(reducer, name);
  });

  it('initializes with initial state', () => {
    expect(wrappedReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('allows actions that have the proper name field', () => {
    expect(wrappedReducer(initialState, { type: 'ACTION_ONE', name })).toEqual({
      ...initialState,
      value: 22,
    });
  });

  it('ignores actions that do not have the proper name field', () => {
    const wrongName = 'WRONG_TESTING';

    expect(wrappedReducer(initialState, { type: 'ACTION_ONE', name: wrongName })).toEqual({
      ...initialState,
    });
  });
});
