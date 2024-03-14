/* eslint-disable react/prop-types */
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { actions } from "../../actions";
import threeDotsIcon from "../../assets/icons/3dots.svg";
import DeleteIcon from "../../assets/icons/delete.svg";
import EditIcon from "../../assets/icons/edit.svg";
import { useAuth } from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";
import { useBlog } from "../../hooks/useBlog";
import { formattedDate } from "../../utils/date-utils";

export default function BlogCard({ blog }) {
	const { auth } = useAuth();
	const { api } = useAxios();
	const { dispatch } = useBlog();
	const [showDotsItem, setShowDotsItem] = useState(false);

	const handleDotItems = () => {
		setShowDotsItem(!showDotsItem);
	};

	const handleBlogDelete = async (id) => {
		try {
			dispatch({
				type: actions.blog.DATA_FETCHING,
			});
			const response = await api.delete(
				`${import.meta.env.VITE_BASE_SERVER_URL}/blogs/${id}`
			);

			if (response.status === 200) {
				dispatch({
					type: actions.blog.BLOG_DELETED,
					payload: { blogId: id },
				});
				toast.success("Blog Deleted!", {
					position: "top-right",
				});
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="blog-card">
			<Link to={`/details/${blog?.id}`}>
				<img
					className="blog-thumb"
					src={`${
						import.meta.env.VITE_BASE_SERVER_URL
					}/uploads/blog/${blog.thumbnail}`}
					alt={blog.title}
				/>
			</Link>
			<div className="mt-2 relative">
				<h3 className="text-slate-300 text-xl lg:text-2xl">
					<Link to={`/details/${blog.id}`}>{blog.title}</Link>
				</h3>
				<Link to={`/details/${blog.id}`}>
					<p className="mb-6 text-base text-slate-500 mt-1">
						{blog.content}
					</p>
				</Link>
				<div className="flex justify-between items-center">
					<div className="flex items-center capitalize space-x-2">
						<div className="avater-img bg-indigo-600 text-white">
							<Link to={`/author/${blog.author?.id}`}>
								{blog?.author?.avatar ? (
									<img
										src={`${
											import.meta.env.VITE_BASE_SERVER_URL
										}/uploads/avatar/${
											blog?.author?.avatar
										}`}
										alt={blog?.author?.firstName}
										className="border-2 border-gray-400 rounded-full"
									/>
								) : (
									<span className="">
										{blog?.author?.firstName?.charAt(0)}
									</span>
								)}
							</Link>
						</div>
						<div>
							<h5 className="text-slate-500 text-sm">
								<Link to={`/author/${blog.author?.id}`}>
									{blog?.author?.firstName +
										" " +
										blog?.author?.lastName}
								</Link>
							</h5>
							<div className="flex items-center text-xs text-slate-700">
								<span>
									{formattedDate(blog?.createdAt, "short")}
								</span>
							</div>
						</div>
					</div>
					<div className="text-sm px-2 py-1 text-slate-700">
						<span>{blog?.likes?.length} Likes</span>
					</div>
				</div>

				<div className="absolute right-0 top-0">
					<button onClick={handleDotItems}>
						{auth?.user?.id === blog?.author?.id ? (
							<img src={threeDotsIcon} alt="3dots of Action" />
						) : null}
					</button>
					{auth?.user?.id === blog?.author?.id ? (
						<>
							{showDotsItem && (
								<>
									<div className="action-modal-container">
										<Link
											to={`/editing/${blog?.id}`}
											className="action-menu-item hover:text-lwsGreen"
										>
											<img src={EditIcon} alt="Edit" />
											Edit
										</Link>
										<button
											onClick={() =>
												handleBlogDelete(blog?.id)
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
		</div>
	);
}
