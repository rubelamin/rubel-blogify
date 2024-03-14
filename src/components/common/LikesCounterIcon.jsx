import { useEffect, useState } from "react";
import { FaRegThumbsUp } from "react-icons/fa";
import { toast } from "react-toastify";
import { actions } from "../../actions";
import LikeIcon from "../../assets/icons/like.svg";
import { useAuth } from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";
import { useBlog } from "../../hooks/useBlog";
import { useIsLiked } from "../../hooks/useIsLiked";

export default function LikesCounterIcon({ details }) {
	const { auth } = useAuth();
	const { api } = useAxios();
	const { state, dispatch } = useBlog();
	const { isLiked } = useIsLiked(details?.likes);
	const [checkLiked, setCheckLiked] = useState(null);

	useEffect(() => {
		if (isLiked) {
			setCheckLiked(isLiked);
		}

		return () => {
			setCheckLiked(false);
		};
	}, [details?.likes?.length, isLiked]);

	const handleLike = async (blogId) => {
		if (!auth?.authToken) {
			return toast.warning("Please login to your account!", {
				position: "top-right",
			});
		}

		try {
			const response = await api.post(
				`/blogs/${blogId}/like`,
				{},
				{
					headers: {
						Authorization: `Bearer ${auth.authToken}`,
					},
				}
			);

			if (response.data.isLiked === true) {
				dispatch({
					type: actions.singleBlog.BLOG_LIKED,
					data: response.data.likes,
				});
				setCheckLiked(!checkLiked);
				toast.success("You liked this blog", {
					position: "bottom-right",
				});
			} else if (response.data.isLiked === false) {
				dispatch({
					type: actions.singleBlog.BLOG_LIKED,
					data: response.data.likes,
				});
				setCheckLiked(!checkLiked);
				toast.warning("You unliked this blog!", {
					position: "bottom-right",
				});
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<button
			className="flex justify-between items-center gap-1"
			onClick={() => handleLike(details?.id)}
		>
			{checkLiked && auth?.user ? (
				<FaRegThumbsUp size={24} color="green" />
			) : (
				<img src={LikeIcon} alt="like" />
			)}
			<span>{state?.singleBlog?.likes?.length}</span>
		</button>
	);
}
