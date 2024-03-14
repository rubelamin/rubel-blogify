import { useEffect, useState } from "react";
import { api } from "../api";

const useAllBlogs = () => {
	const [allBlogs, setAllBlogs] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchBlog = async () => {
			setLoading(true);
			try {
				const response = await api.get(
					`${
						import.meta.env.VITE_BASE_SERVER_URL
					}/blogs?page=1&limit=500`
				);

				if (response.status === 200) {
					setAllBlogs(response.data.blogs);
				}
				setLoading(false);
			} catch (error) {
				setLoading(false);
				console.error(error);
			}
		};
		fetchBlog();

		return () => {
			setAllBlogs([]);
		};
	}, []);

	return {
		loading,
		allBlogs,
	};
};

export default useAllBlogs;
