import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { FaCheck } from "react-icons/fa6";
import { toast } from "react-toastify";
import EditIcon from "../assets/icons/edit.svg";
import BlogCard from "../components/blogs/BlogCard";
import Field from "../components/common/Field";
import ProfileImage from "../components/profile/ProfileImage";
import useAllBlogs from "../hooks/useAllBlogs";
import { useAuth } from "../hooks/useAuth";
import useAxios from "../hooks/useAxios";
import { useBlog } from "../hooks/useBlog";

export default function ProfileMe() {
	const { auth, setAuth } = useAuth();
	const { api } = useAxios();

	const { allBlogs } = useAllBlogs();
	const { state } = useBlog();

	const [authorProfile, setAuthorProfile] = useState({});
	const [authorBlogs, setAuthorBlogs] = useState([]);

	const [bioEditor, setBioEditor] = useState(false);
	const [nameEditor, setNameEditor] = useState(false);
	const [bioText, setBioText] = useState("");
	const [name, setName] = useState({
		firstName: "",
		lastName: "",
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	useEffect(() => {
		if (!state?.loading) {
			const fetchProfile = async () => {
				try {
					const response = await api.get(
						`/profile/${auth?.user?.id}`,
						{
							headers: {
								Authorization: `Bearer ${auth?.authToken}`,
							},
						}
					);

					if (response.status === 200) {
						setAuthorProfile(response.data);

						setName({
							firstName: response.data.firstName,
							lastName: response.data.lastName,
						});
						setBioText(response.data.bio);

						const updatedBlogs = response.data.blogs.filter(
							(authBlg) =>
								allBlogs?.some((blg) => blg.id === authBlg.id)
						);

						setAuthorBlogs(updatedBlogs);
					}
				} catch (error) {
					console.log(error);
				}
			};

			fetchProfile();
		}

		return () => {
			setName({
				firstName: "",
				lastName: "",
			});
			setNameEditor(false);
			setBioEditor(false);
		};
	}, [allBlogs, api, auth?.authToken, auth?.user?.id, state?.loading]);

	const handleProfileData = async (data) => {
		const keepStorage = localStorage.getItem("authUser");
		await localStorage.removeItem("authUser");
		try {
			const response = await api.patch("/profile", data, {
				headers: {
					Authorization: `Bearer ${auth?.authToken}`,
				},
			});
			if (response.status === 200) {
				toast.success("Your profile has been updated", {
					position: "top-right",
				});
				setAuthorProfile(response.data.user);
				setAuth({
					...auth,
					user: response.data.user,
				});
				setName({
					firstName: response.data.user.firstName,
					lastName: response.data.user.lastName,
				});
				setBioText(response.data.user.bio);

				const updatedAuth = {
					...auth,
					user: response.data.user,
				};
				localStorage.setItem("authUser", JSON.stringify(updatedAuth));
			}
		} catch (error) {
			await localStorage.setItem("authUser", keepStorage);
			toast.error("Something wrong!", {
				position: "top-right",
			});
		}
	};

	return (
		<main className="mx-auto max-w-[1020px] py-8">
			<div className="container">
				{/* profile info */}
				<div className="flex flex-col items-center py-8 text-center">
					{/* profile image */}
					<ProfileImage authorProfile={authorProfile} />
					{/* name , email */}
					<form onSubmit={handleSubmit(handleProfileData)}>
						<div className="flex-row">
							<div className="flex justify-center gap-2 ">
								{!nameEditor ? (
									<div className="flex-1">
										<h3 className="text-xl font-semibold text-white lg:text-[28px]">
											{name?.firstName +
												" " +
												name?.lastName}
										</h3>
									</div>
								) : (
									<div className="flex gap-1">
										<Field error={errors.firstName}>
											<input
												{...register("firstName", {
													required:
														"First name can not be empty!",
												})}
												type="text"
												name="firstName"
												id="firstName"
												defaultValue={
													name?.firstName
														? name?.firstName
														: "First Name"
												}
												className="w-full p-3 bg-[#030317] border border-white/20 rounded-md focus:outline-none focus:border-indigo-500"
											/>
										</Field>
										<Field error={errors.lastName}>
											<input
												{...register("lastName", {
													required:
														"Last name can not be empty!",
												})}
												type="text"
												name="lastName"
												id="lastName"
												defaultValue={
													name?.lastName
														? name?.lastName
														: "Last Name"
												}
												className="w-full p-3 bg-[#030317] border border-white/20 rounded-md focus:outline-none focus:border-indigo-500"
											/>
										</Field>
									</div>
								)}

								{auth?.user?.id === authorProfile?.id && (
									<>
										{!nameEditor ? (
											<button
												onClick={(e) => {
													e.preventDefault();
													setNameEditor(true);
												}}
												className="flex-center h-7 w-7 rounded-full"
											>
												<img
													src={EditIcon}
													alt="Edit"
												/>
											</button>
										) : (
											<button
												onClick={() =>
													setNameEditor(false)
												}
												className="flex-center h-7 w-7 rounded-full"
											>
												<FaCheck
													size={24}
													color="gray"
												/>
											</button>
										)}
									</>
								)}
							</div>
							<p className="leading-[231%] lg:text-lg">
								{authorProfile?.email}
							</p>
						</div>
						{/* bio */}
						<div className="mt-4 flex items-start gap-2 lg:mt-6">
							<div className="flex-1">
								{!bioEditor ? (
									<p className="leading-[188%] text-gray-400 lg:text-lg">
										{bioText}
									</p>
								) : (
									<Field error={errors.userBio}>
										<textarea
											{...register("bio", {
												required:
													"Write at least 3 words!",
												minLength: {
													value: 3,
													message:
														"Not yet 3 words!!",
												},
											})}
											name="bio"
											id="bio"
											rows={2}
											cols={50}
											defaultValue={bioText}
											className="w-full p-3 bg-[#030317] border border-white/20 rounded-md focus:outline-none focus:border-indigo-500"
										/>
									</Field>
								)}
							</div>
							{/* Edit Bio button. The Above bio will be editable when clicking on the button */}
							{auth?.user?.id === authorProfile?.id && (
								<>
									{bioEditor === false ? (
										<button
											onClick={(e) => {
												e.preventDefault();
												setBioEditor(true);
											}}
											className="flex-center h-7 w-7 rounded-full"
										>
											<img src={EditIcon} alt="Edit" />
										</button>
									) : (
										<button
											onClick={() => {
												setBioEditor(false);
											}}
											className="flex-center h-7 w-7 rounded-full"
										>
											<FaCheck size={24} color="gray" />
										</button>
									)}
								</>
							)}
						</div>
					</form>
					<div className="w-3/4 border-b border-[#3F3F3F] py-6 lg:py-8" />
				</div>
				{/* end profile info */}
				<h4 className="mt-6 text-xl lg:mt-8 lg:text-2xl">Your Blogs</h4>
				<div className="my-6 space-y-4">
					{/* Blog Card Start */}
					{authorBlogs?.map((blog) => (
						<BlogCard key={blog.id} blog={blog} />
					))}

					{/* Blog Card End */}
				</div>
			</div>
		</main>
	);
}
