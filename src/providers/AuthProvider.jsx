/* eslint-disable react/prop-types */
import { useState } from "react";
import { AuthContext } from "../context";

export default function AuthProvider({ children }) {
	const loggedUser = localStorage.getItem("authUser");
	const aU = JSON.parse(loggedUser);
	const [auth, setAuth] = useState(aU || {});

	return (
		<AuthContext.Provider value={{ auth, setAuth }}>
			{children}
		</AuthContext.Provider>
	);
}
