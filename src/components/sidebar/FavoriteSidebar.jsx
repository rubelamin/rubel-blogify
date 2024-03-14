import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { ErrorBoundary } from "react-error-boundary";
import useAllBlogs from "../../hooks/useAllBlogs";
import { useAuth } from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";

export default function FavoriteSidebar() {
	const { auth } = useAuth();
	const { api } = useAxios();
	const { allBlogs } = useAllBlogs();
	const [favBlogs, setFavBlogs] = useState([]);

	useEffect(() => {
		const fetchFav = async () => {
			if (!auth.user) {
				return;
			} else {
				try {
					const response = await api.get("/blogs/favourites", {
						headers: {
							Authorization: `Bearer ${auth?.authToken}`,
						},
					});
					if (response.status === 200) {
						// if any blog user make favorited but blog author can remove that blog
						// favourite array exist in user data table so need to match blog id from blog db
						const updatedFav = response.data.blogs.filter((fv) =>
							allBlogs?.some((blg) => blg.id === fv.id)
						);
						setFavBlogs([...updatedFav]);
					}
				} catch (error) {
					console.log(error);
				}
			}
		};

		fetchFav();

		return () => {
			setFavBlogs([]);
		};
	}, [allBlogs, api, auth, auth?.authToken]);

	return (
		<div className="sidebar-card">
			<h3 className="text-slate-300 text-xl lg:text-2xl font-semibold">
				Your Favourites ❤️
			</h3>
			<ErrorBoundary
				fallback={<div>Favourites blog fetching error!</div>}
			>
				<ul className="space-y-5 my-5">
					{favBlogs?.length > 0 ? (
						<>
							{favBlogs?.map((fav) => (
								<li key={fav?.id}>
									<h3 className="text-slate-400 font-medium hover:text-slate-300 transition-all cursor-pointer">
										<Link to={`/details/${fav.id}`}>
											{fav?.title}
										</Link>
									</h3>
									<p className="flex flex-wrap text-slate-600 text-sm">
										{fav.tags &&
											fav.tags
												.split(", ")
												.map((tag, i) => (
													<span
														className="mr-1"
														key={i}
													>
														#{tag}
														{i !==
															fav.tags.split(", ")
																.length -
																1 && ","}
													</span>
												))}
									</p>
								</li>
							))}
						</>
					) : (
						<li>
							<p className="text-slate-600 text-sm">
								You have no blog in your favourite list yet!
							</p>
						</li>
					)}
				</ul>
			</ErrorBoundary>
		</div>
	);
}
