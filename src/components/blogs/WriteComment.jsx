import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { actions } from "../../actions";
import { useAuth } from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";
import { useBlog } from "../../hooks/useBlog";
import Field from "../common/Field";

export default function WriteComment({ details }) {
	const { auth } = useAuth();
	const { api } = useAxios();
	const { dispatch } = useBlog();

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm();

	const submitComment = async (content) => {
		try {
			const response = await api.post(
				`${import.meta.env.VITE_BASE_SERVER_URL}/blogs/${
					details?.id
				}/comment`,
				content,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `${auth?.authToken}`,
					},
				}
			);
			if (response.status === 200) {
				dispatch({
					type: actions.singleBlog.DATA_FETCHED,
					payload: { ...response.data },
				});
				toast.success("Successfully posted comment.", {
					position: "top-right",
				});
				reset();
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="relative flex items -center space-x-4">
			{!auth?.user && (
				<div className="absolute flex w-full h-full bg-slate-500 opacity-50 z-10 justify-center items-center">
					<p className="text-white">
						Please login first <Link to={"/login"}>Login Here</Link>
					</p>
				</div>
			)}

			{auth?.user && (
				<div className="avater-img bg-indigo-600 text-white">
					{auth?.user?.avatar ? (
						<img
							src={`${
								import.meta.env.VITE_BASE_SERVER_URL
							}/uploads/avatar/${auth?.user?.avatar}`}
							alt={auth?.user?.firstName}
							className="border-2 border-gray-400 rounded-full"
						/>
					) : (
						<span className="">
							{auth?.user?.firstName?.charAt(0)}
						</span>
					)}
				</div>
			)}
			<div className="w-full">
				<form onSubmit={handleSubmit(submitComment)}>
					<Field error={errors.content}>
						<textarea
							{...register("content", {
								required: "Cannot submit empty!",
							})}
							name="content"
							id="content"
							className="w-full bg-[#030317] border border-slate-500 text-slate-300 p-4 rounded-md focus:outline-none"
							placeholder={
								auth?.user
									? `Hi ${auth?.user?.firstName}, Please Write a nice comment`
									: "Write a comment"
							}
							defaultValue={""}
						/>
					</Field>
					{auth?.user && (
						<div className="flex justify-end mt-4">
							<button className="bg-indigo-600 text-white px-6 py-2 md:py-3 rounded-md hover:bg-indigo-700 transition-all duration-200">
								Comment
							</button>
						</div>
					)}
				</form>
			</div>
		</div>
	);
}
