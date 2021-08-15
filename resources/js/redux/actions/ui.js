import store from '../store';

export const SET_CRUMBS = 'redux/actions/UI/SET_CRUMBS';
export const REMOVE_CRUMB = 'redux/actions/UI/REMOVE_CRUMB';



export const setCrumbs = (position, crumb) => {
	store.dispatch({
		type: SET_CRUMBS,
		position,
		crumb
	});
}

export const deleteCrumb = (position) => {
	store.dispatch({
		type: REMOVE_CRUMB,
		position
	});
}

