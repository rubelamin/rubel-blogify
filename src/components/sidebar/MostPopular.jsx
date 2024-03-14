import { useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Link } from "react-router-dom";
import { api } from "../../api";

export default function MostPopular() {
	const [popularBlogs, setPopularBlogs] = useState([]);
	const [loading, setLoading] = useState(false);
	const [popularError, setPopularError] = useState(null);

	useEffect(() => {
		const fetchPopularBlog = async () => {
			try {
				setLoading(true);
				const response = await api.get("/blogs/popular");

				if (response.status === 200) {
					setPopularBlogs(response.data.blogs);
					setLoading(false);
				}
			} catch (error) {
				setLoading(false);
				setPopularError("Popular blogs loading error!");
			}
		};

		fetchPopularBlog();
	}, []);

	return (
		<div className="sidebar-card">
			<h3 className="text-slate-300 text-xl lg:text-2xl font-semibold">
				Most Popular 👍️
			</h3>
			<ErrorBoundary fallback={<div>Popular blog fetching erros!</div>}>
				<ul className="space-y-5 my-5">
					{loading && <li>Loading popular blogs....</li>}
					{popularError && (
						<li>
							<p className="text-slate-600 text-sm">
								{popularError}
							</p>
						</li>
					)}

					{popularBlogs?.length > 0 && (
						<>
							{popularBlogs?.map((blog) => (
								<li key={blog?.id}>
									<h3 className="text-slate-400 font-medium hover:text-slate-300 transition-all cursor-pointer">
										<Link to={`/details/${blog?.id}`}>
											{blog?.title}
										</Link>
									</h3>
									<p className="text-slate-600 text-sm">
										by{" "}
										<Link
											to={`/author/${blog?.author?.id}`}
										>
											{blog?.author?.firstName +
												" " +
												blog?.author?.lastName}
										</Link>
										<span>·</span> {blog?.likes?.length}{" "}
										Likes
									</p>
								</li>
							))}
						</>
					)}
				</ul>
			</ErrorBoundary>
		</div>
	);
}
