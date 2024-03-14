import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";

export default function Logout() {
	const navigate = useNavigate();

	const { setAuth } = useAuth();

	const handleLogout = () => {
		localStorage.removeItem("authUser");
		setAuth({});

		toast.success("Successfully Logged Out!", {
			position: "top-right",
		});

		navigate("/");
	};
	return <button onClick={handleLogout}>Logout</button>;
}
