import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { api } from "../../api";
import { useAuth } from "../../hooks/useAuth";
import Field from "../common/Field";

export default function LoginForm() {
	const navigate = useNavigate();
	const { setAuth } = useAuth();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const loginSubmit = async (data) => {
		try {
			const response = await api.post("/auth/login", data);

			if (response.status === 200) {
				const { user, token } = response.data;
				if (token) {
					const authToken = token.accessToken;
					const refreshToken = token.refreshToken;

					const forLocalStorage = JSON.stringify({
						user,
						authToken,
						refreshToken,
					});

					localStorage.setItem("authUser", forLocalStorage);

					setAuth({ user, authToken, refreshToken });

					toast.success("Logged in Success!", {
						position: "top-right",
					});

					navigate("/");
				}
			}
		} catch (error) {
			console.log(error);
			if (error) {
				toast.error("Please try again", {
					position: "top-right",
				});
			}
		}
	};

	return (
		<form onSubmit={handleSubmit(loginSubmit)}>
			<Field label={"Email"} error={errors.email}>
				<input
					{...register("email", {
						required: "Please write your email.",
						validate: (value) => value.includes("@"),
					})}
					type="email"
					id="email"
					name="email"
					className="w-full p-3 bg-[#030317] border border-white/20 rounded-md focus:outline-none focus:border-indigo-500"
				/>
			</Field>

			<Field label={"Password"} error={errors.password}>
				<input
					{...register("password", {
						required: "Please enter password!",
						minLength: {
							value: 6,
							message:
								"Minimum password length should be at least 6",
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
					Login
				</button>
			</Field>

			<p className="text-center">
				Dont have an account?{" "}
				<Link
					to="/register"
					className="text-indigo-600 hover:underline"
				>
					Register
				</Link>
			</p>
		</form>
	);
}
