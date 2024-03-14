import { useState } from "react";
import { Link } from "react-router-dom";
import searchIcon from "../assets/icons/search.svg";
import lwsLogo from "../assets/logo.svg";
import { useAuth } from "../hooks/useAuth";
import SearchModal from "./SearchModal";
import Logout from "./auth/Logout";

export default function Header() {
	const { auth } = useAuth();
	const [showSearchModal, setShowSearchModal] = useState(false);

	return (
		<>
			{showSearchModal && (
				<SearchModal setShowSearchModal={setShowSearchModal} />
			)}
			<header>
				<nav className="container">
					<div>
						<Link to={"/"}>
							<img className="w-32" src={lwsLogo} alt="lws" />
						</Link>
					</div>

					<div>
						<ul className="flex items-center space-x-5">
							<li>
								<Link
									to={"/createBlog"}
									className="bg-indigo-600 text-white px-6 py-2 md:py-3 rounded-md hover:bg-indigo-700 transition-all duration-200"
								>
									Write
								</Link>
							</li>
							<li>
								<button
									onClick={() =>
										setShowSearchModal(!showSearchModal)
									}
									className="flex items-center gap-2 cursor-pointer"
								>
									<img src={searchIcon} alt="Search" />
									<span>Search</span>
								</button>
							</li>
							<li>
								{!auth?.user ? (
									<Link
										to={"/login"}
										className="text-white/50 hover:text-white transition-all duration-200"
									>
										Login
									</Link>
								) : (
									<Logout />
								)}
							</li>

							{!auth?.user ? (
								<li>
									<Link
										to={"/register"}
										className="text-white/50 hover:text-white transition-all duration-200"
									>
										Register
									</Link>
								</li>
							) : (
								<li className="flex items-center">
									<div className="avater-img bg-orange-600 text-white">
										{auth?.user?.avatar ? (
											<img
												src={`${
													import.meta.env
														.VITE_BASE_SERVER_URL
												}/uploads/avatar/${
													auth?.user?.avatar
												}`}
												alt={auth?.user?.firstName}
												className="border-2 border-gray-400 rounded-full"
											/>
										) : (
											<span className="">
												{auth?.user?.firstName?.charAt(
													0
												)}
											</span>
										)}
									</div>
									<Link to={`/me`}>
										<span className="text-white ml-2">
											{auth?.user?.firstName +
												" " +
												auth?.user?.lastName}
										</span>
									</Link>
								</li>
							)}
						</ul>
					</div>
				</nav>
			</header>
		</>
	);
}
