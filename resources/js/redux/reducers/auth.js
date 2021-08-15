import { fromJS } from 'immutable';
import { getCookie, setCookie, deleteAllCookies } from '../../utils/cookie';
import { authAction, logoutAction, onlineAction } from '../actions/auth';
const initialState = {
  authenticated: getCookie('authenticated') ? true : false,
  name: getCookie('name'),
  id: getCookie('id'),
	online: getCookie('online'),
	role: getCookie('role'),
	email: getCookie('email')
};
const initialImmutableState = fromJS(initialState);

export default function reducer(state = initialImmutableState, action = {}) {
  switch (action.type) {
    case authAction:
			// remember user session
			setCookie('authenticated', true);
			setCookie('name', action.user.name);
			setCookie('id', action.user.id);
			setCookie('online', action.user.reception);
			setCookie('role', action.user.role);
			setCookie('email', action.user.email);

			return state.withMutations((mutableState) => {
				mutableState.set('authenticated', true);
				mutableState.set('name', action.user.name);
				mutableState.set('id', action.user.id );
				mutableState.set('online', action.user.reception );
				mutableState.set('role', action.user.role );
				mutableState.set('email', action.user.email );
			});
		case onlineAction:
			return state.withMutations((mutableState) => {
				setCookie('online', action.value);
				mutableState.set('online', action.value);
			});
		case logoutAction:
			deleteAllCookies();
			return state.withMutations((mutableState) => {
				mutableState.set('authenticated', false);
				mutableState.set('name', null);
        mutableState.set('id', null );
        mutableState.set('online', 0);
        mutableState.set('role', null);
        mutableState.set('email', null);
			});
    default:
      return state;
  }
}
