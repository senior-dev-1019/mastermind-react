import { request } from '../../utils/request';
import {
	ALL_USERS_URL,
	VIEW_USER,
	VIEW_END_REPORT,
	GET_CALLS_URL,
	GET_REPORTS_URL,
	CHANGE_EMAIL_URL,
	CHANGE_PASSWORD_URL,
	DELETE_CALL_URL,
	HOTEL_SETTINGS_URL,
	HOTEL_HOME_URL,
	HOTEL_LOCK_URL,
	HOTEL_REFRESH_URL,
	DELETE_ACCOUNT_URL,
	GET_VIDEO_SETTINGS,
	SAVE_VIDEO_SETTINGS,
	SUBMIT_HOTEL_SETTINGS,
	CREATE_USER_URL
} from './adminRoutes';

export const SET_USERS = 'redux/actions/users/SET_USERS';
export const HANDLE_LOADER = 'redux/actions/users/HANDLE_LOADER';
export const CHANGE_FILTERS = 'redux/actions/users/CHANGE_FILTERS';

export const getUsers = (filters) => {
  return dispatch => {
		request(ALL_USERS_URL, filters).then( ({ data }) => {
			dispatch({
				type: SET_USERS,
				users: data.users
			});
		});
	}
}

export const viewUser = user_id => {
	return request(VIEW_USER, { user_id });
}

export const viewEndReport = end_report_id => {
	return request(VIEW_END_REPORT, { end_report_id });
}

export const handleLoading = (loading) => ({
	type: HANDLE_LOADER,
	loading
});

export const getCalls = filters => request(GET_CALLS_URL, filters);

export const getReports = filters => request(GET_REPORTS_URL, filters);

// change password
export const changePassword = (user_id, password) => request(CHANGE_PASSWORD_URL, { user_id, password });

// change email
export const changeEmail = (user_id, email) => request(CHANGE_EMAIL_URL, { user_id, email });

// delete call
export const deleteCall = (call_id) => request(DELETE_CALL_URL, {call_id});

// hotel settings
export const hotelSettings = (user_id) => request(HOTEL_SETTINGS_URL, {user_id});

// hotel home
export const hotelHome = (user_id) => request(HOTEL_HOME_URL, {user_id});

// hotel home
export const hotelLock = (user_id) => request(HOTEL_LOCK_URL, {user_id});

// hotel refresh
export const hotelRefresh = (user_id) => request(HOTEL_REFRESH_URL, {user_id});

export const deleteAccount = (user_id) => request(DELETE_ACCOUNT_URL, {user_id});

export const getSettings = () => request(GET_VIDEO_SETTINGS, {});

export const saveSettings = (settings) => request(SAVE_VIDEO_SETTINGS, settings);

export const submitSettings = (settings) => request(SUBMIT_HOTEL_SETTINGS, settings);

export const createUser = (user) => request(CREATE_USER_URL, user);