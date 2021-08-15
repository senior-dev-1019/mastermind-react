import { request } from '../../utils/request';
import { getCookie } from '../../utils/cookie';
import { listReportsRoute, listContactsRoute, removeMissedCallRoute, listMissingCallsRoute, pusherLogRoute } from './routes';

import moment from 'moment';
export const getReportsAction = 'redux/actions/reports/getReportsAction';
export const removeMissedCallAction = 'redux/actions/calls/removeMissedCallAction';
export const listMissingCallsAction = 'redux/actions/calls/MissedCallAction';
export const resetLoadingsAction = 'redux/actions/calls/resetLoadingsAction';
export const SET_CONTACTS = 'redux/actions/calls/SET_CONTACTS';

/**
 * action to get all calls
 * @param { name } the current user name -> refactor this
 * @param { time }
 */
export const getReports = () => {
  return dispatch => request(listReportsRoute, {
    name: getCookie('name'),
    time: moment().format('YYYY-MM-DD HH:mm:ss')
  }).then( ({ data }) => {
    dispatch({
      type: getReportsAction,
      calls: data.data
    })
  })
}

export const loading = () => ({
  type: resetLoadingsAction
});