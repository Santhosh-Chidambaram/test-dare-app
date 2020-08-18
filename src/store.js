import {createStore,combineReducers,applyMiddleware} from 'redux'
import thunkMiddleware from 'redux-thunk';
import {createLogger} from 'redux-logger';


import UserReducer from './reducers/UserReducer';
import ChallengeReducer from './reducers/ChallengeReducer';

const loggerMiddleware = createLogger();

const rootReducer = combineReducers({
    userState:UserReducer,
    challengeState:ChallengeReducer,
})


export default function configureStore(preloadedState) {
    return createStore(
      rootReducer,
      preloadedState,
      applyMiddleware(thunkMiddleware, loggerMiddleware),
    );
  }