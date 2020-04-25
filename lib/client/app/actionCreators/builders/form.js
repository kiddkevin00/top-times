import actionTypes from '../../actionTypes';

const { FORM } = actionTypes;

export default name => ({
  resetFormState() {
    return {
      type: FORM.RESET_STATE,
      name,
    };
  },

  setFormField(field, value) {
    return {
      type: FORM.SET_FIELD,
      payload: { field, value },
      name,
    };
  },

  setFormFieldValidationResult(field, validationResult) {
    return {
      type: FORM.SET_FIELD_VALIDATION_RESULT,
      payload: { field, validationResult },
      name,
    };
  },

  setFormIsValidating() {
    return {
      type: FORM.SET_IS_VALIDATING,
      name,
    };
  },
});
