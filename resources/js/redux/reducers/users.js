import { fromJS } from 'immutable';
import { SET_USERS, HANDLE_LOADER, CHANGE_FILTERS } from '../actions/admin';
const initialState = {
  users: [],
  filters: {
		name: '',
		ustatus: '',
		type: ''
	},
  loading: false,
};
const initialImmutableState = fromJS(initialState);

export default function reducer(state = initialImmutableState, action = {}) {
  switch (action.type) {
    case SET_USERS:
      return state.withMutations((mutableState) => {
        mutableState.set('users', fromJS(action.users));
        mutableState.set('loading', false);
			});
		case HANDLE_LOADER:
			return state.withMutations((mutableState) => {
        mutableState.set('loading', action.loading);
			});
		case CHANGE_FILTERS:
			return state.withMutations((mutableState) => {
        mutableState.set('filters', action.filters);
			});
    default:
      return state;
  }
}
