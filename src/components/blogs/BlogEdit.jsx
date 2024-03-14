import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";
import { URLtoFile } from "../../utils";
import Field from "../common/Field";

export default function BlogEdit() {
	const { blogId } = useParams();
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm();

	const navigate = useNavigate();
	// const { dispatch } = useBlog();
	const { auth } = useAuth();
	const { api } = useAxios();
	const thumbRef = useRef(null);

	const [postThumb, setPostThumb] = useState(null);
	const [fileImage, setFileImage] = useState(null);
	const [blogDetails, setBlogDetails] = useState({});

	useEffect(() => {
		const fetchBlog = async () => {
			try {
				const response = await api.get(`/blogs/${blogId}`);
				if (response.status === 200) {
					setBlogDetails(response.data);
					const thumbUrl = `${
						import.meta.env.VITE_BASE_SERVER_URL
					}/uploads/blog/${response.data.thumbnail}`;

					setPostThumb(thumbUrl);
					const flimg = await URLtoFile(thumbUrl);
					setFileImage(flimg);

					setValue("title", response.data.title);
					setValue("tags", response.data.tags);
					setValue("content", response.data.content);
				}
			} catch (error) {
				console.log(error);
				if (error.response.status === 404) {
					navigate("/notfound");
				}
			}
		};

		fetchBlog();
	}, [api, blogId, navigate, setValue]);

	const handleBlogUpdate = async (formData) => {
		const formDataWithFile = new FormData();
		await formDataWithFile.append("title", formData.title);
		formDataWithFile.append("tags", formData.tags);
		formDataWithFile.append("content", formData.content);
		formDataWithFile.append("thumbnail", fileImage);

		try {
			const response = await api.patch(
				`/blogs/${blogId}`,
				formDataWithFile,
				{
					headers: {
						Authorization: `Bearer ${auth?.authToken}`,
					},
				}
			);

			if (response) {
				toast.success("Blog updated successfully!", {
					position: "top-right",
				});

				navigate(`/details/${response.data.id}`);
			}
		} catch (error) {
			console.log(error);
			toast.error(`Something wen wrong!`, {
				position: "bottom-right",
			});
		}
	};

	const handleThumbnail = () => {
		thumbRef.current.click();
		// thumbRef.current.addEventListener("change", thumbPreview);
	};

	const thumbPreview = (event) => {
		const file = event.target.files[0];
		const urlImage = URL.createObjectURL(file);
		setFileImage(file);

		setPostThumb(urlImage);
	};

	return (
		<main>
			<section>
				<div className="container">
					<form
						onSubmit={handleSubmit(handleBlogUpdate)}
						className="createBlog"
					>
						{postThumb ? (
							<div
								onClick={handleThumbnail}
								className="flex flex-col items-center  cursor-pointer"
							>
								<img
									src={postThumb}
									className="w-full aspect-video object-cover rounded-xl"
								/>
								<p className="bg-slate-500 p-1 mt-1 rounded">
									Change Image
								</p>
							</div>
						) : (
							<div className="grid place-items-center bg-slate-600/20 h-[150px] rounded-md my-4">
								<div
									onClick={handleThumbnail}
									className="flex items-center gap-4 hover:scale-110 transition-all cursor-pointer"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth="1.5"
										stroke="currentColor"
										className="w-6 h-6"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
										/>
									</svg>
									<p>Upload Your Image</p>
								</div>
							</div>
						)}

						<Field error={errors.thumbnail}>
							<input
								{...register("thumbnail")}
								type="file"
								name="thumbnail"
								id="thumbnail"
								ref={thumbRef}
								hidden
								onChange={thumbPreview}
							/>
						</Field>
						<div className="mb-6">
							<input
								{...register("title", {
									required: "Blog tile must not be empty!",
								})}
								type="text"
								id="title"
								name="title"
								placeholder="Enter your blog title"
								defaultValue={blogDetails?.title || ""}
							/>
						</div>
						<Field error={errors.tags}>
							<input
								{...register("tags", {
									required: "Enter post tags.",
								})}
								type="text"
								id="tags"
								name="tags"
								placeholder="Your Comma Separated Tags Ex. JavaScript, React, Node, Express,"
								defaultValue={blogDetails?.tags || ""}
							/>
						</Field>
						<Field error={errors.content}>
							<textarea
								{...register("content", {
									required: "Please write content.",
								})}
								id="content"
								name="content"
								placeholder="Write your blog content"
								rows={8}
								defaultValue={blogDetails?.content || ""}
							/>
						</Field>
						<Field>
							<button
								type="submit"
								className="bg-indigo-600 text-white px-6 py-2 md:py-3 rounded-md hover:bg-indigo-700 transition-all duration-200"
							>
								Update Blog
							</button>
						</Field>
					</form>
				</div>
			</section>
		</main>
	);
}
