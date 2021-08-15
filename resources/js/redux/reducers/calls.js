import { fromJS } from 'immutable';
import { getCallsAction, SET_CONTACTS, listMissingCallsAction, resetLoadingsAction } from '../actions/calls';
const initialState = {
  callsLoading: true,
  contactsLoading: true,
  missedLoading: true,
  calls: [],
  contacts: [],
  missed: []
};
const initialImmutableState = fromJS(initialState);

export default function reducer(state = initialImmutableState, action = {}) {
  switch (action.type) {
    case getCallsAction:
      return state.withMutations((mutableState) => {
        mutableState.set('calls', fromJS(action.calls));
        mutableState.set('callsLoading', false);
      });
    case SET_CONTACTS:
      return state.withMutations(mutableState => {
        mutableState.set('contacts', fromJS(action.contacts));
        mutableState.set('contactsLoading', false);
      });
    case listMissingCallsAction:
      return state.withMutations(mutableState => {
        mutableState.set('missed', fromJS(action.missed));
        mutableState.set('missedLoading', false);
      });
    case resetLoadingsAction:
      return state.withMutations(mutableState => {
        mutableState.set('callsLoading', true);
        mutableState.set('contactsLoading', true);
        mutableState.set('missedLoading', true);
      });
    default:
      return state;
  }
}
