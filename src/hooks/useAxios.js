import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "./useAuth";

const useAxios = () => {
	const { auth, setAuth } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		const requestInterceptor = api.interceptors.request.use(
			(config) => {
				const authToken = auth?.authToken;
				if (authToken) {
					config.headers.Authorization = `Bearer ${authToken}`;
					console.log(authToken);
				}
				return config;
			},
			(error) => Promise.reject(error)
		);

		const responseInterceptor = api.interceptors.response.use(
			(response) => response,
			async (error) => {
				const originalRequest = error.config;

				if (error.response.status === 403 && !originalRequest._retry) {
					originalRequest._retry = true;

					try {
						const freshToken = auth?.refreshToken;

						const response = await axios.post(
							`http://localhost:3000/auth/refresh-token`,
							{
								refreshToken: freshToken,
							},
							{
								headers: {
									"Content-Type": "application/json",
									Authorization: `Bearer ${auth.authToken}`,
								},
							}
						);

						console.log(response);

						const { accessToken, refreshToken } = response.data;

						setAuth({
							...auth,
							authToken: accessToken,
							refreshToken: refreshToken,
						});

						// maintain localstorage
						localStorage.removeItem("authUser");
						const authJson = JSON.stringify({
							...auth,
							authToken: accessToken,
							refreshToken: refreshToken,
						});
						console.log(authJson);

						localStorage.setItem("authUser", authJson);

						originalRequest.headers.Authorization = `Bearer ${accessToken}`;
						return api(originalRequest);
					} catch (error) {
						console.error("Failed to refresh token:", error);
						setAuth({});
						navigate("/login");
					}
				}

				return Promise.reject(error);
			}
		);

		return () => {
			api.interceptors.request.eject(requestInterceptor);
			api.interceptors.response.eject(responseInterceptor);
		};
	}, [navigate, auth, setAuth]);

	return { api };
};

export default useAxios;
