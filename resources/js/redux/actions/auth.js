import { request } from '../../utils/request';
import { loginRoute, userStateRoute, meRoute, logoutRoute } from './routes';
import { getCookie, deleteAllCookies } from '../../utils/cookie';
import store from '../store';
export const authAction = 'redux/actions/Auth/authenticate';
export const logoutAction = 'redux/actions/Auth/logout';
export const onlineAction = 'redux/actions/Auth/online';

export const login = data => {
	return request(loginRoute, data);
}

export const authenticate = (user) => ({
	type: authAction,
	user
});

export const logout = () => {
	// return dispatch => {
	// 	request(logoutRoute, {});
	// 	setTimeout(() => {
	// 		dispatch({
	// 			type: logoutAction
	// 		});
	// 	},400)
	// }
	return dispatch => request(logoutRoute, {}).then(() => {
		deleteAllCookies();
		window.location.replace('/');
	})
}

export const setOnline = (value) => {
	return dispatch => {
		dispatch({
			type: onlineAction,
			value
		});
		request(userStateRoute, {id_user: getCookie('id') ,reception: value});
	}
}

export const meData = () => request(meRoute, {}).then(({ data }) => {
	if (data.status) {
		store.dispatch({
			type: authAction,
			user: data.user
		})
	}
});