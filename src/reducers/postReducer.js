import { actions } from "../actions/index";

const initialState = {
	posts: [],
	loading: false,
	error: null,
};

const postReducer = (state, action) => {
	switch (action.type) {
		case actions.post.DATA_FETCHING:
			return {
				...state,
				loading: true,
			};

		case actions.post.DATA_FETCHED:
			return {
				...state,
				loading: false,
				posts: action.data,
			};

		case actions.post.DATA_ERROR:
			return {
				...state,
				loading: false,
				error: action.error,
			};

		default:
			return state;
	}
};

export { initialState, postReducer };
