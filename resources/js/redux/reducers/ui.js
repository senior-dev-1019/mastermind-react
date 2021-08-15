import { fromJS } from 'immutable';
import { SET_CRUMBS, REMOVE_CRUMB } from '../actions/ui';

const initialState = {
  sidebarOpen: true,
  theme: 'starter',
  pageLoaded: false,
  crumbs: fromJS([
    {
      title: 'Main',
      url: '/app'
    },
    {
      title: 'Users',
      url: '/users'
    }
  ])
};
const initialImmutableState = fromJS(initialState);

export default function reducer(state = initialImmutableState, action = {}) {
  switch (action.type) {
    case SET_CRUMBS:
      return state.withMutations((mutableState) => {
        const crumbs = mutableState.get('crumbs').toJS();
        if(crumbs.length < action.position) {
          crumbs.push(action.crumb);
        }else{
          crumbs[action.position] = action.crumb;
        }
        mutableState.set('crumbs', fromJS(crumbs));
      });
    case REMOVE_CRUMB:
      return state.withMutations((mutableState) => {
        const crumbs = mutableState.get('crumbs').toJS();
        if(crumbs.length >= action.position){
          crumbs.splice(action.position, 1); 
        }
        mutableState.set('crumbs', fromJS(crumbs));
      });
    default:
      return state;
  }
}
