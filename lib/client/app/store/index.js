import rootReducer from '../reducers';
import { applyMiddleware, compose, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';

const configureStore = initialState => {
  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(thunkMiddleware),
      process.env.NODE_ENV !== 'test' && window.__REDUX_DEVTOOLS_EXTENSION__
        ? window.__REDUX_DEVTOOLS_EXTENSION__()
        : f => f
    )
  );

  return store;
};

export { configureStore as default };
