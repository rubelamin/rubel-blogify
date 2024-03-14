import { useEffect, useRef } from "react";

const useDebounce = (callback, delay) => {
	const timeoutRef = useRef(null);

	useEffect(() => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
	}, []);

	const debouncedCallBack = (...args) => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		timeoutRef.current = setTimeout(() => {
			callback(...args);
		}, delay);
	};

	return debouncedCallBack;
};

export default useDebounce;
