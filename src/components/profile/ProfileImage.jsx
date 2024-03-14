import { useRef } from "react";
import { toast } from "react-toastify";
import EditIcon from "../../assets/icons/edit.svg";
import { useAuth } from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";

export default function ProfileImage({ authorProfile }) {
	const { auth, setAuth } = useAuth();
	const { api } = useAxios();

	const avatarRef = useRef();

	const handleUpload = (e) => {
		e.preventDefault();
		avatarRef.current.click();
		avatarRef.current.addEventListener("change", avatarUpdate);
	};

	const avatarUpdate = async () => {
		const formData = new FormData();

		for (const file of avatarRef.current.files) {
			formData.append("avatar", file);
		}

		try {
			const response = await api.post(
				`${import.meta.env.VITE_BASE_SERVER_URL}/profile/avatar`,
				formData,
				{
					headers: {
						Authorization: `Bearer ${auth?.authToken}`,
					},
				}
			);

			if (response.status === 200) {
				toast.success("Profile image updated", {
					position: "top-right",
				});

				setAuth({
					...auth,
					user: {
						...auth.user,
						avatar: response.data.user.avatar,
					},
				});
			}
		} catch (error) {
			console.log(error);
			toast.error("Something went wrong", { position: "top-right" });
		}
	};

	return (
		<div className="relative mb-8 max-h-[180px] max-w-[180px] h-[120px] w-[120px] rounded-full lg:mb-11 lg:max-h-[218px] lg:max-w-[218px]">
			<div className="w-full h-full bg-orange-600 text-white grid place-items-center text-5xl rounded-full">
				{auth?.user?.avatar ? (
					<img
						src={`${
							import.meta.env.VITE_BASE_SERVER_URL
						}/uploads/avatar/${auth?.user?.avatar}`}
						alt={authorProfile?.firstName}
						className="border-2 border-gray-400 rounded-full"
					/>
				) : (
					<span className="">
						{authorProfile?.firstName?.charAt(0)}
					</span>
				)}
			</div>

			<form encType="maltipart/form-data">
				<button
					onClick={handleUpload}
					type="submit"
					className="grid place-items-center absolute bottom-0 right-0 h-7 w-7 rounded-full bg-slate-700 hover:bg-slate-700/80"
				>
					<img src={EditIcon} alt="Edit" />
				</button>
				<input id="file" type="file" ref={avatarRef} hidden />
			</form>
		</div>
	);
}
