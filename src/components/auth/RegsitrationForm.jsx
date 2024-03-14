import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { api } from "../../api";
import Field from "../common/Field";

export default function RegsitrationForm() {
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const submitForm = async (data) => {
		try {
			const response = await api.post("/auth/register", data);

			if (response) {
				toast.success("Registration success!", {
					position: "top-right",
				});

				navigate("/login");
			}
		} catch (error) {
			console.log(error);
			if (error) {
				toast.error(`${error.message}`, {
					position: "top-right",
					theme: "dark",
				});
			}
		}
	};
	return (
		<form onSubmit={handleSubmit(submitForm)} autoComplete="off">
			<Field label={"First Name"} error={errors.firstName}>
				<input
					{...register("firstName", {
						required: "Write your First Name!",
					})}
					type="text"
					id="firstName"
					name="firstName"
					className="w-full p-3 bg-[#030317] border border-white/20 rounded-md focus:outline-none focus:border-indigo-500"
				/>
			</Field>

			<Field label={"Last Name"} error={errors.lastName}>
				<input
					{...register("lastName", {
						required: "Write your last name!",
					})}
					type="text"
					id="lastName"
					name="lastName"
					className="w-full p-3 bg-[#030317] border border-white/20 rounded-md focus:outline-none focus:border-indigo-500"
				/>
			</Field>

			<Field label={"Email"} error={errors.email}>
				<input
					{...register("email", { required: "Write a valid email!" })}
					type="email"
					id="email"
					name="email"
					className="w-full p-3 bg-[#030317] border border-white/20 rounded-md focus:outline-none focus:border-indigo-500"
				/>
			</Field>

			<Field label={"Password"} error={errors.password}>
				<input
					{...register("password", {
						required: "Password can not be empty!",
						minLength: {
							value: 6,
							message:
								"Password should be at least 6 characters!",
						},
					})}
					type="password"
					id="password"
					name="password"
					className="w-full p-3 bg-[#030317] border border-white/20 rounded-md focus:outline-none focus:border-indigo-500"
				/>
			</Field>

			<Field>
				<button
					type="submit"
					className="w-full bg-indigo-600 text-white p-3 rounded-md hover:bg-indigo-700 transition-all duration-200"
				>
					Create Account
				</button>
			</Field>
			<p className="text-center">
				Already have account?{" "}
				<Link to={"/login"} className="text-indigo-600 hover:underline">
					Login
				</Link>
			</p>
		</form>
	);
}
