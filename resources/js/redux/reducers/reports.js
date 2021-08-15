import { fromJS } from 'immutable';
import { getReportsAction, resetLoadingsAction } from '../actions/reports';
const initialState = {
  reportsLoading: true,
  contacts: [],
};
const initialImmutableState = fromJS(initialState);

export default function reducer(state = initialImmutableState, action = {}) {
  switch (action.type) {
    case getReportsAction:
      return state.withMutations((mutableState) => {
        mutableState.set('reports', fromJS(action.reports));
        mutableState.set('reportsLoading', false);
      });
    case resetLoadingsAction:
      return state.withMutations(mutableState => {
        mutableState.set('reportsLoading', true)
      });
    default:
      return state;
  }
}
