import { combineReducers } from 'redux';
import ui from './reducers/ui';
import auth from './reducers/auth';
import calls from './reducers/calls';
import calling from './reducers/calling';
import users from './reducers/users';

export default function reducers() {
  return combineReducers({
    ui,
    auth,
    calls,
    calling,
    users
  });
}