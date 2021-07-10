'use strict';

import { combineReducers } from 'redux';
import user from './userReducer'
import AuthReducer from './AuthReducer'
const rootReducer = combineReducers({
	login: AuthReducer,
	user: user
});

export default rootReducer;
