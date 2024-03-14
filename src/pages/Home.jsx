import BlogCard from "../components/blogs/BlogCard";
import HomeSidebar from "../components/sidebar/HomeSidebar";

import { useEffect, useRef, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { actions } from "../actions";
import Loading from "../components/common/Loading";
import useAxios from "../hooks/useAxios";
import { useBlog } from "../hooks/useBlog";

export default function Home() {
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	// const [blogs, setBlogs] = useState([]);

	const loadingRef = useRef(null);

	const { state, dispatch } = useBlog();

	const { api } = useAxios();

	useEffect(() => {
		dispatch({
			type: actions.blog.DATA_CLEAN,
		});
	}, [dispatch]);

	useEffect(() => {
		const fetchBlog = async () => {
			dispatch({ type: actions.blog.DATA_FETCHING });
			try {
				const response = await api.get(
					`${
						import.meta.env.VITE_BASE_SERVER_URL
					}/blogs?page=${page}&limit=10`
				);

				if (response?.data?.blogs?.length === 0) {
					setHasMore(false);
					dispatch({ type: actions.blog.DATA_NOT_FETCHING });
				} else {
					dispatch({
						type: actions.blog.DATA_FETCHED,
						data: response.data.blogs,
					});

					setPage((prevP) => prevP + 1);
				}
			} catch (error) {
				dispatch({
					type: actions.blog.DATA_ERROR,
					error: error.message,
				});
			}
		};

		const onIntersection = (blogItems) => {
			const blogItem = blogItems[0];

			if (blogItem.isIntersecting && hasMore) {
				fetchBlog();
			}
		};

		const observer = new IntersectionObserver(onIntersection);

		if (observer && loadingRef.current) {
			observer.observe(loadingRef.current);
		}

		// cleanup
		return () => {
			if (observer) {
				observer.disconnect();
			}
		};
	}, [api, dispatch, hasMore, page]);

	if (state?.loading)
		return (
			<div className="flex w-full h-screen justify-center items-center">
				Blogs are finding......
			</div>
		);

	if (state?.error)
		return (
			<div className="flex w-full h-screen justify-center items-center">
				There something error found!
			</div>
		);

	console.log(hasMore);
	console.log(loadingRef);

	return (
		<>
			<main>
				<section>
					<div className="container">
						<div className="grid grid-cols-1 md:grid-cols-7 gap-4">
							<ErrorBoundary
								fallback={
									<div>There is an error to load blogs!</div>
								}
							>
								<div className="space-y-3 md:col-span-5">
									{state?.blogs.map((blog) => (
										<BlogCard blog={blog} key={blog?.id} />
									))}

									{hasMore && (
										<div
											ref={loadingRef}
											id="loadMore"
											className="flex w-full items-center justify-center"
										>
											<Loading />
										</div>
									)}
								</div>
							</ErrorBoundary>

							<HomeSidebar />
						</div>
					</div>
				</section>
			</main>
		</>
	);
}
