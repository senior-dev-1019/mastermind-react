import { fromJS } from 'immutable';
import { callAction, someoneIsCallingAction, answerAction, rejectAction, endCallAction, callLoading } from '../actions/calling';
const initialState = {
	loading: false,
	ringing: false,
	otherName: '',
	incommingCall: {},
	activeCall: {},
};
const initialImmutableState = fromJS(initialState);

export default function reducer(state = initialImmutableState, action = {}) {
  switch (action.type) {
		case callLoading:
			return state.withMutations((mutableState) => {
				mutableState.set('loading', true);
			});
		case callAction:
			return state.withMutations((mutableState) => {
				mutableState.set('ringing', false);
				mutableState.set('activeCall', fromJS(action.data));
				mutableState.set('otherName', action.name || '');
				mutableState.set('loading', false);
			});
    case someoneIsCallingAction:
      return state.withMutations((mutableState) => {
				mutableState.set('ringing', true);
				mutableState.set('incommingCall', fromJS(action.callData) );
				mutableState.set('loading', false);
			});
		case answerAction:
			return state.withMutations((mutableState) => {
				mutableState.set('ringing', false);
				mutableState.set('incommingCall', fromJS({}));
				mutableState.set('activeCall', action.call);
				mutableState.set('otherName', action.name || '');
				mutableState.set('loading', false);
			});
		case rejectAction:
			return state.withMutations((mutableState) => {
				mutableState.set('ringing', false);
				mutableState.set('incommingCall', fromJS({}));
				mutableState.set('activeCall', action.call);
				mutableState.set('otherName', action.name || '');
				mutableState.set('loading', false);
			});
		case endCallAction:
			return state.withMutations((mutableState) => {
				mutableState.set('ringing', false);
				mutableState.set('incommingCall', fromJS({}));
				mutableState.set('activeCall', fromJS({}));
				mutableState.set('otherName', '');
				mutableState.set('loading', false);
			});
    default:
      return state;
  }
}
