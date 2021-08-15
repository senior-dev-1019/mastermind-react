/**
 * Api routes
 */ // android backend
const API_URL = process.env.MIX_V1_URL;

// laravel project url
const API_URL_V2 = process.env.MIX_V2_URL;

// login route
export const loginRoute = `${API_URL_V2}/user/login`;

// me data
export const meRoute = `${API_URL_V2}/admin/user/me`;

// logout
export const logoutRoute = `${API_URL_V2}/user/logout`;
// user online offline
export const userStateRoute = `${API_URL}/user/setworkmode.php`;

// ringing route
export const ringingRoute = '/api/call/ringing';

// call
export const callRoute = `${API_URL}/call/call.php`;

// list calls route
export const listCallsRoute = `${API_URL}/call/list.php`;

// list reports route
export const listReportsRoute = `${API_URL}/call/reports.php`;

// remove missed call
export const removeMissedCallRoute = `${API_URL}/call/removemissed.php`;

// end call route
export const endCallRoute = `${API_URL}/call/hangup.php`;

// upload snapshot
export const sendSnapshot = `${API_URL}/snapshot/upload.php`;

// list contacts
export const listContactsRoute = `${API_URL}/user/list.php`;

// list missed calls

export const listMissingCallsRoute = `${API_URL}/call/listgroup.php`;

// snapshot upload

export const uploadSnapshotRoute = `${API_URL}/snapshot/upload.php`;

// change hotel config

export const changeHotelConfigRoute = `${API_URL}/server_config/temp_config.php`;

// call answer
export const answerRoute = `${API_URL}/call/answer.php`;


export const pusherLogRoute = `${API_URL}/log/create.php`;

export const getCallRoute = `${API_URL_V2}/call/view`;