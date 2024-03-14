import { actions } from "../actions";

const initialState = {
	auth: {},
};

const authReducer = (state, action) => {
	switch (action.type) {
		case actions.userAuth.DATA_AUTh:
			return {
				...state,
				auth: { ...action.payload },
			};

		case actions.userAuth.LOGGED_OUT:
			return {
				auth: {},
			};

		default:
			return state;
	}
};

export { authReducer, initialState };
