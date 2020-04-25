import buildReducer from '../../../../lib/client/app/reducers/builders/form';
import actionTypes from '../../../../lib/client/app/actionTypes';

describe('Builder for form reducer', () => {
  const name = 'TESTING';
  let initialState;
  let reducer;

  beforeEach(() => {
    initialState = {
      field1: {
        value: '',
        isValid: false,
        isValidating: false,
      },
      field2: {
        value: '',
        isValid: false,
        isValidating: false,
      },
    };

    reducer = buildReducer(initialState, name);
  });

  it('initializes with initial state', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('sets the value of a form field', () => {
    const field = 'field1';
    const value = 'a test value for field 1';

    expect(
      reducer(initialState, {
        payload: { field, value },
        type: actionTypes.FORM.SET_FIELD,
        name,
      })
    ).toEqual({
      ...initialState,
      field1: {
        ...initialState.field1,
        value,
      },
    });
  });

  it('ignores actions that do not have the proper name field', () => {
    const field = 'field1';
    const value = 'a test value for field 1';
    const wrongName = 'WRONG_TESTING';

    expect(
      reducer(initialState, {
        payload: { field, value },
        type: actionTypes.FORM.SET_FIELD,
        name: wrongName,
      })
    ).toEqual({ ...initialState });
  });

  it('sets the validation result of a form field', () => {
    const field = 'field2';
    const validationResult = true;

    expect(
      reducer(initialState, {
        payload: { field, validationResult },
        type: actionTypes.FORM.SET_FIELD_VALIDATION_RESULT,
        name,
      })
    ).toEqual({
      ...initialState,
      field2: {
        ...initialState.field2,
        isValidating: false,
        isValid: validationResult,
      },
    });
  });

  it('sets the is validating flag on each form field', () => {
    const previousState = { ...initialState, field3: { value: '' } };

    expect(
      reducer(previousState, {
        type: actionTypes.FORM.SET_IS_VALIDATING,
        name,
      })
    ).toEqual({
      ...previousState,
      field1: {
        ...previousState.field1,
        isValidating: true,
      },
      field2: {
        ...previousState.field2,
        isValidating: true,
      },
    });
  });

  it('resets to the initial state', () => {
    expect(reducer({}, { type: actionTypes.FORM.RESET_STATE, name })).toEqual(initialState);
  });
});
