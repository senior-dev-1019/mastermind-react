import { request } from '../../utils/request';
import {
    playIncoming,
    stopIncoming
} from '../../utils/sounds';
import {
    ringingRoute,
    callRoute,
    endCallRoute,
    uploadSnapshotRoute,
    changeHotelConfigRoute,
    answerRoute,
    getCallRoute
} from './routes';
import { getCookie } from '../../utils/cookie';

export const callAction = 'redux/actions/calling/callAction';
export const someoneIsCallingAction = 'redux/actions/calling/someoneIsCallingAction';
export const answerAction = 'redux/actions/calling/answerAction';
export const rejectAction = 'redux/actions/calling/rejectAction';
export const endCallAction = 'redux/actions/calling/endCallAction';
export const ringingAction = 'redux/actions/calling/ringingAction';
export const callLoading = 'redux/actions/calling/callLoading';

export const ringing = (call_id) => {
    return request(ringingRoute, {call_id});
}

export const call = (call_id, name)  => {
    return dispatch => {
        dispatch({
            type: callLoading
        });
        request(callRoute, { id_target: call_id, name_caller: getCookie('name') }).then((response) => {
            const { data } = response.data;
            dispatch({
                type: callAction,
                data: {
                    event: 'call',
                    id_call: data.id_call,
                    id_caller: data.id_caller,
                    id_target: data.id_target,
                    name_caller: data.name_caller
                },
                name
            });
        });
    }
}

export const endCallWithBusy = data => {
    stopIncoming();
    return request(endCallRoute, data);
}
export const endCall = data => {
    stopIncoming();
    return dispatch => request(endCallRoute, data).then(response => {
        dispatch({
            type: endCallAction,
            data: response.data
        })
    })
}
export const answer = call => {
    stopIncoming();
    return dispatch => {
        dispatch({
            type: endCallAction
        });
        const name = getCookie('name');
        return request(answerRoute, {id_call: call.get('id_call'), name_receiver: name}).then(resp =>{
            if(resp.data.hasOwnProperty('success') && !resp.data.success){
                dispatch({
                    type: rejectAction
                });
            }else{
                dispatch({
                    type: answerAction,
                    call,
                    name: call.get('name_caller')
                })
            }
        });
    }
}

export const getCall = (call_id) => request(getCallRoute, { call_id });

export const reject = call => {
    stopIncoming();
    return dispatch => {
        // make api call to reject call
        dispatch({
            type: rejectAction,
            call
        })
    }
}

export const stopCall = () => {
    // reject action is cleaning the call reducer
    return dispatch => {
        dispatch({
            type: endCallAction
        })
    }
}

export const someoneIsCalling = callData => {
    playIncoming();
    return dispatch => {
        dispatch({
            type: someoneIsCallingAction,
            callData: callData
        })
    };
}

export const changeHotelConfig = (id_target, snapshot) => {
    try{
        return request(changeHotelConfigRoute, {id_target, snapshot});
    }catch(e){
        console.log(e);
    }
};

export const uploadSnapshot = (id_call, snapshot) => {
    return request(uploadSnapshotRoute, {
        id_call: id_call,
        snapshot: snapshot
    });
}
