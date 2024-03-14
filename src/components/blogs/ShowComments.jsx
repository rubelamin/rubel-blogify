import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { actions } from "../../actions";
import threeDotsIcon from "../../assets/icons/3dots.svg";
import DeleteIcon from "../../assets/icons/delete.svg";
import { useAuth } from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";
import { useBlog } from "../../hooks/useBlog";

export default function ShowComments() {
	const { auth } = useAuth();

	const { api } = useAxios();

	const { blogId } = useParams();
	const { state, dispatch } = useBlog();

	const [showDotsItem, setShowDotsItem] = useState({});

	const handleDotItems = (commentId) => {
		setShowDotsItem((prevState) => ({
			...prevState,
			[commentId]: !prevState[commentId],
		}));
	};

	const handleDeleteComment = async (commentId) => {
		try {
			const response = await api.delete(
				`${
					import.meta.env.VITE_BASE_SERVER_URL
				}/blogs/${blogId}/comment/${commentId}`
			);
			if (response.status === 200) {
				dispatch({
					type: actions.singleBlog.DATA_FETCHED,
					payload: { ...response.data },
				});
				toast.success("Comment Deleted!", {
					position: "top-right",
				});
			}
		} catch (error) {
			console.log(error);
			toast.error("Something went wrong", {
				position: "top-right",
			});
		}
	};
	return (
		<>
			{state?.singleBlog?.comments
				?.slice()
				.reverse()
				.map((comment) => (
					<div
						key={comment.id}
						className="relative flex items-start space-x-4 my-8"
					>
						<div className="avater-img bg-orange-600 text-white">
							<Link to={`/author/${comment?.author?.id}`}>
								{comment?.author?.avatar ? (
									<img
										src={`${
											import.meta.env.VITE_BASE_SERVER_URL
										}/uploads/avatar/${
											comment?.author?.avatar
										}`}
										alt={comment?.author?.firstName}
										className="border-2 border-gray-400 rounded-full"
									/>
								) : (
									<span className="">
										{comment.author?.firstName?.charAt(0)}
									</span>
								)}
							</Link>
						</div>
						<div className="w-full">
							<h5 className="text-slate -500 font-bold">
								<Link to={`/author/${comment?.author?.id}`}>
									{comment?.author?.firstName +
										" " +
										comment?.author?.lastName}
								</Link>
							</h5>
							<p className="text-slate-300">{comment?.content}</p>
						</div>

						<div className="absolute right-0 top-0">
							<button onClick={() => handleDotItems(comment?.id)}>
								{auth?.user?.id === comment?.author?.id ? (
									<img
										src={threeDotsIcon}
										alt="3dots of Action"
									/>
								) : null}
							</button>
							{auth?.user?.id === comment?.author?.id ? (
								<>
									{showDotsItem[comment?.id] && (
										<>
											<div className="action-modal-container">
												<button
													onClick={() =>
														handleDeleteComment(
															comment?.id
														)
													}
													className="action-menu-item hover:text-red-500"
												>
													<img
														src={DeleteIcon}
														alt="Delete"
													/>
													Delete
												</button>
											</div>
										</>
									)}
								</>
							) : null}
						</div>
					</div>
				))}
		</>
	);
}
