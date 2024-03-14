import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";

const useIsLiked = (likesArr) => {
	const [isLiked, setIsLiked] = useState(false);

	const { auth } = useAuth();

	useEffect(() => {
		if (auth?.user) {
			const lked = likesArr?.some(
				(blogLiked) => blogLiked.id === auth?.user?.id
			);
			if (lked) {
				setIsLiked(true);
			}
		}
	}, [auth?.user, auth?.user?.id, likesArr]);

	return {
		isLiked,
	};
};

export { useIsLiked };
