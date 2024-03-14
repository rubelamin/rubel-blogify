import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import useAxios from "./useAxios";

const useFavorite = (id) => {
	const [isFavourite, setIsFavourite] = useState(false);
	const [favouriteLoading, setFavouriteLoading] = useState(true);

	const { auth } = useAuth();
	const { api } = useAxios();

	useEffect(() => {
		const fetchFav = async () => {
			if (!auth.user) {
				setFavouriteLoading(false);
				return;
			} else {
				try {
					const response = await api.get("/blogs/favourites", {
						headers: {
							Authorization: `Bearer ${auth?.authToken}`,
						},
					});

					if (response.status === 200) {
						const res = response.data.blogs.some(
							(fav) => fav.id === id
						);
						if (res) {
							setIsFavourite(true);
							setFavouriteLoading(false);
						}
					}
				} catch (error) {
					console.log(error);
				}
			}
			setFavouriteLoading(false);
		};
		fetchFav();
	}, [api, auth, id]);

	return {
		isFavourite,
		favouriteLoading,
	};
};

export { useFavorite };
