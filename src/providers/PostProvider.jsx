/* eslint-disable react/prop-types */
import { useReducer } from "react";
import { PostsContext } from "../context";
import { initialState, postReducer } from "../reducers/postReducer";

export default function PostProvider({ children }) {
	const [state, dispatch] = useReducer(postReducer, initialState);

	return (
		<PostsContext.Provider value={{ state, dispatch }}>
			{children}
		</PostsContext.Provider>
	);
}
