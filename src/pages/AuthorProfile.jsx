import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";

import EditIcon from "../assets/icons/edit.svg";
import BlogCard from "../components/blogs/BlogCard";
import { useAuth } from "../hooks/useAuth";

export default function AuthorProfile() {
	const { auth } = useAuth();
	const { authorId } = useParams();

	const [authorProfile, setAuthorProfile] = useState({});

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const response = await api.get(`/profile/${authorId}`);

				if (response.status === 200) {
					setAuthorProfile(response.data);
				}
			} catch (error) {
				console.log(error);
			}
		};

		fetchProfile();
	}, [authorId]);

	return (
		<main className="mx-auto max-w-[1020px] py-8">
			<div className="container">
				<div className="flex flex-col items-center py-8 text-center">
					<div className="relative mb-8 max-h-[180px] max-w-[180px] h-[120px] w-[120px] rounded-full lg:mb-11 lg:max-h-[218px] lg:max-w-[218px]">
						<div className="w-full h-full bg-orange-600 text-white grid place-items-center text-5xl rounded-full">
							{authorProfile?.avatar ? (
								<img
									src={`${
										import.meta.env.VITE_BASE_SERVER_URL
									}/uploads/avatar/${authorProfile?.avatar}`}
									alt={authorProfile?.firstName}
									className="border-2 border-gray-400 rounded-full"
								/>
							) : (
								<span className="">
									{authorProfile?.firstName?.charAt(0)}
								</span>
							)}
						</div>
						{auth?.user?.id === authorProfile?.id && (
							<button className="grid place-items-center absolute bottom-0 right-0 h-7 w-7 rounded-full bg-slate-700 hover:bg-slate-700/80">
								<img src={EditIcon} alt="Edit" />
							</button>
						)}
					</div>

					<div>
						<h3 className="text-2xl font-semibold text-white lg:text-[28px]">
							{authorProfile?.firstName +
								" " +
								authorProfile?.lastName}
						</h3>
						<p className="leading-[231%] lg:text-lg">
							{authorProfile?.email}
						</p>
					</div>

					<div className="mt-4 flex items-start gap-2 lg:mt-6">
						<div className="flex-1">
							<p className="leading-[188%] text-gray-400 lg:text-lg">
								{authorProfile?.bio}
							</p>
						</div>

						{auth?.user?.id === authorProfile?.id && (
							<button className="flex-center h-7 w-7 rounded-full">
								<img src={EditIcon} alt="Edit" />
							</button>
						)}
					</div>
					<div className="w-3/4 border-b border-[#3F3F3F] py-6 lg:py-8" />
				</div>

				<h4 className="mt-6 text-xl lg:mt-8 lg:text-2xl">
					{auth?.user?.id === authorProfile?.id ? (
						"Your Blogs"
					) : (
						<>
							{authorProfile?.firstName +
								" " +
								authorProfile?.lastName}
							&#39;s Blogs
						</>
					)}{" "}
					({authorProfile?.blogs?.length})
				</h4>
				<div className="my-6 space-y-4">
					{authorProfile?.blogs?.map((blog) => (
						<BlogCard key={blog.id} blog={blog} />
					))}
				</div>
			</div>
		</main>
	);
}
