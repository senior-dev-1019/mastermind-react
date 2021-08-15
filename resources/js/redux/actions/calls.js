import { request } from '../../utils/request';
import { getCookie } from '../../utils/cookie';
import { listCallsRoute, listContactsRoute, removeMissedCallRoute, listMissingCallsRoute, pusherLogRoute } from './routes';

import moment from 'moment';
export const getCallsAction = 'redux/actions/calls/getCallsAction';
export const removeMissedCallAction = 'redux/actions/calls/removeMissedCallAction';
export const listMissingCallsAction = 'redux/actions/calls/MissedCallAction';
export const resetLoadingsAction = 'redux/actions/calls/resetLoadingsAction';
export const SET_CONTACTS = 'redux/actions/calls/SET_CONTACTS';

/**
 * action to get all calls
 * @param { name } the current user name -> refactor this
 * @param { time }
 */
export const getCalls = () => {
  return dispatch => request(listCallsRoute, {
    name: getCookie('name'),
    time: moment().format('YYYY-MM-DD HH:mm:ss')
  }).then( ({ data }) => {
    dispatch({
      type: getCallsAction,
      calls: data.data
    })
  })
}

/**
 * action to remove missed call
 * @var {call_id} the call id
 */
export const removeMissedCall = (id_caller, callback) => {
  return dispatch => request(removeMissedCallRoute, { id_caller: id_caller }).then(response => {
    dispatch({
      type: removeMissedCallAction,
      id_caller
    });
    if(callback){
      callback(response.data);
    }
  }).catch(e => {
    // handle backend error
  })
}

/**
 * action to get all user contacts
 *
 */
export const getContacts = () => {
  return dispatch => request(listContactsRoute, { role: 0 }).then(response => {
    dispatch({
      type: SET_CONTACTS,
      contacts: response.data.data
    })
  });
}

/**
 * action to get missed calls
 */

export const listMissingCalls = () => {
  return dispatch => request(listMissingCallsRoute, { name: getCookie('name'), time: moment().format('YYYY-MM-DD HH:mm:ss')  }).then( response => {
    dispatch({
      type: listMissingCallsAction,
      missed: response.data.data || []
    })
  });
}

export const loading = () => ({
  type: resetLoadingsAction
})

export const pusherLog = message => {
  message.user_local_time = moment().format('YYYY-MM-DD HH:mm:ss');
  return request(pusherLogRoute, {
    id_user: getCookie('id'),
    message
  });
}