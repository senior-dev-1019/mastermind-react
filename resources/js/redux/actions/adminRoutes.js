// Admin Laravel url
const API_URL = process.env.MIX_V2_URL;

// all users route
export const ALL_USERS_URL = `${API_URL}/admin/user/all`;

// shift manager route
export const ADD_SHIFT_MANAGER = `${API_URL}/admin/shift/resolve`;
export const GET_SHIFTS = `${API_URL}/admin/shift/all`;
export const DELETE_SHIFTS = `${API_URL}/admin/shift/delete`;

// change user
export const CHANGE_USER = `${API_URL}/admin/user/change`;

// user details
export const VIEW_USER = `${API_URL}/admin/user/view`;

// user details
export const VIEW_END_REPORT = `${API_URL}/admin/report/view`;

// calls details
export const GET_CALLS_URL = `${API_URL}/admin/call/all`;

// calls details
export const SAVE_REPORT = `${API_URL}/admin/report/save`;
export const GET_REPORTS_URL = `${API_URL}/admin/report/all`;

// change password
export const CHANGE_PASSWORD_URL = `${API_URL}/admin/user/change-password`;

// change email
export const CHANGE_EMAIL_URL = `${API_URL}/admin/user/change-email`;

// set work time
export const SET_WORK_MODE_URL = `${API_URL}/admin/user/set-work-mode`;

// delete account
export const DELETE_ACCOUNT_URL = `${API_URL}/admin/user/delete-account`;

// delete call
export const DELETE_CALL_URL = `${API_URL}/call/delete`;

// hotel open settings
export const HOTEL_SETTINGS_URL = `${API_URL}/admin/user/settings`;

// hotel open homescreen
export const HOTEL_HOME_URL = `${API_URL}/admin/user/home`;

// hotel lock
export const HOTEL_LOCK_URL = `${API_URL}/admin/user/lock`;

// hotel refresh
export const HOTEL_REFRESH_URL = `${API_URL}/admin/user/refresh`;

// settings url
export const GET_VIDEO_SETTINGS = `${API_URL}/admin/config/video-settings`;
export const SAVE_VIDEO_SETTINGS = `${API_URL}/admin/config/save-video-settings`;
export const SUBMIT_HOTEL_SETTINGS = `${API_URL}/admin/user/hotel-settings`;
export const CREATE_USER_URL = `${API_URL}/admin/user/create`;