import { useEffect } from "react";

const useAuthRemover = () => {
	useEffect(() => {
		return () => {
			localStorage.removeItem("authUser");
		};
	}, []);
};

export { useAuthRemover };
