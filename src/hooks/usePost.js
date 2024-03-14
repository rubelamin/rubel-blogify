import { useContext } from "react";

import { PostsContext } from "../context";

export const usePost = () => {
	return useContext(PostsContext);
};
