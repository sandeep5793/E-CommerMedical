import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import {AsyncStorage} from 'react-native'
import thunk from 'redux-thunk';
// import storage from 'redux-persist/lib/storage';
const { default: immutableStateInvariant } = require('redux-immutable-state-invariant');

import logger from 'redux-logger';
import rootReducer from '../reducers';

const persistConfig = {
  key: 'root',
  storage:AsyncStorage,
  timeout: null,

};

let middleware = [thunk];
if (__DEV__) {
  const reduxImmutableStateInvariant = immutableStateInvariant();
  middleware = [...middleware, reduxImmutableStateInvariant, logger];
} else {
  middleware = [...middleware];
}

const persistedReducer = persistReducer(persistConfig, rootReducer);
export default function configureStore() {
  const store = createStore(
    persistedReducer,
    applyMiddleware(...middleware),
  );

  const persistor = persistStore(store);
  return { store, persistor };
}