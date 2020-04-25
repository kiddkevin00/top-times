import buildActionCreator from '../../../../lib/client/app/actionCreators/builders/form';
import actionTypes from '../../../../lib/client/app/actionTypes';

const { FORM } = actionTypes;

describe('Builder for form action creator ', () => {
  const name = 'TESTING';
  let actionCreator;

  beforeEach(() => {
    actionCreator = buildActionCreator(name);
  });

  it('creates an action to reset form state', () => {
    expect(actionCreator.resetFormState()).toEqual({
      type: FORM.RESET_STATE,
      name,
    });
  });

  it('creates an action to set form field', () => {
    const field = 'SomeField';
    const value = 'some value';

    expect(actionCreator.setFormField(field, value)).toEqual({
      type: FORM.SET_FIELD,
      payload: { field, value },
      name,
    });
  });

  it('creates an action to set validate result', () => {
    const field = 'SomeField';
    const validationResult = true;

    expect(actionCreator.setFormFieldValidationResult(field, validationResult)).toEqual({
      type: FORM.SET_FIELD_VALIDATION_RESULT,
      payload: { field, validationResult },
      name,
    });
  });

  it('creates an action to set form is validating', () => {
    expect(actionCreator.setFormIsValidating()).toEqual({
      type: FORM.SET_IS_VALIDATING,
      name,
    });
  });
});
