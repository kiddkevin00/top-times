import buildNamedWrapperReducer from './namedWrapper';
import actionTypes from '../../actionTypes';

const { FORM } = actionTypes;

export default (initialState, name) => {
  const formReducer = (state = initialState, action) => {
    const actionType = action.type;
    const actionPayload = action.payload;

    switch (actionType) {
      case FORM.RESET_STATE:
        return { ...initialState };
      case FORM.SET_FIELD:
        return {
          ...state,
          [actionPayload.field]: {
            ...state[actionPayload.field],
            value: actionPayload.value,
            dirty: true,
          },
        };
      case FORM.SET_FIELD_VALIDATION_RESULT:
        return {
          ...state,
          [actionPayload.field]: {
            ...state[actionPayload.field],
            isValid: actionPayload.validationResult,
            isValidating: false,
          },
        };
      case FORM.SET_IS_VALIDATING:
        return {
          ...state,
          ...Object.keys(state)
            .map(field =>
              Object.keys(state[field]).includes('isValidating')
                ? { [field]: { ...state[field], isValidating: true } }
                : { [field]: { ...state[field] } }
            )
            .reduce((acc, curr) => ({ ...acc, ...curr }), {}),
        };
      default:
        return state;
    }
  };

  return buildNamedWrapperReducer(formReducer, name);
};
