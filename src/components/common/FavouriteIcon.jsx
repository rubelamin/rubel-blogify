import { toast } from "react-toastify";
import { actions } from "../../actions";
import { api } from "../../api";
import FavoriteFilledIcon from "../../assets/icons/heart-filled.svg";
import FavoriteIcon from "../../assets/icons/heart.svg";
import { useAuth } from "../../hooks/useAuth";
import { useBlog } from "../../hooks/useBlog";
import { useFavorite } from "../../hooks/useFavourite";

export default function FavouriteIcon({ details }) {
	const { auth } = useAuth();
	const { favouriteLoading } = useFavorite(details?.id);
	const { state, dispatch } = useBlog();

	const handleFav = async (blogId) => {
		if (!auth?.authToken) {
			return toast.warning("Please login to your account!", {
				position: "top-right",
			});
		}

		try {
			const response = await api.patch(
				`/blogs/${blogId}/favourite`,
				{},
				{
					headers: {
						Authorization: `Bearer ${auth.authToken}`,
					},
				}
			);

			if (response.data.isFavourite === true) {
				dispatch({
					type: actions.singleBlog.BLOG_FAVOURITED,
					data: response.data.isFavourite,
				});
				toast.success("Succeefully favorited this blog", {
					position: "top-right",
				});
			} else if (response.data.isFavourite === false) {
				dispatch({
					type: actions.singleBlog.BLOG_FAVOURITED,
					data: response.data.isFavourite,
				});
				toast.warning("Succeefully removed from favourite!", {
					position: "top-right",
				});
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			{favouriteLoading ? (
				"..."
			) : (
				<button onClick={() => handleFav(details?.id)}>
					{state?.singleBlog?.isFavourite && auth?.user ? (
						<img src={FavoriteFilledIcon} alt="Favourite" />
					) : (
						<img src={FavoriteIcon} alt="Favourite" />
					)}
				</button>
			)}
		</>
	);
}
