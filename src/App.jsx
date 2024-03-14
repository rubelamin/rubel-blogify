import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./pages/Home";
import ProfileMe from "./pages/ProfileMe";
import BlogProvider from "./providers/BlogProvider";
import PrivateRoute from "./routes/PrivateRoute";

import { Route, Routes } from "react-router-dom";
import BlogDetails from "./components/blogs/BlogDetails";
import BlogEdit from "./components/blogs/BlogEdit";
import BlogHandle from "./components/blogs/BlogHandle";
import NotFound from "./components/common/NotFound";
import { useAuthRemover } from "./hooks/useAuthRemover";
import AuthorProfile from "./pages/AuthorProfile";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";

function App() {
	useAuthRemover();
	return (
		<BlogProvider>
			<Header />
			<Routes>
				<Route element={<PrivateRoute />}>
					<Route element={<ProfileMe />} path="/me" />
					<Route element={<BlogHandle />} path="/createBlog" />
					<Route element={<BlogEdit />} path="/editing/:blogId" />
				</Route>

				<Route element={<LoginPage />} path="/login" />
				<Route element={<RegistrationPage />} path="/register" />

				<Route element={<Home />} path="/" index />
				<Route element={<BlogDetails />} path="/details/:blogId" />
				<Route element={<AuthorProfile />} path="/author/:authorId" />
				<Route element={<NotFound />} path="/notfound" />
				<Route element={<NotFound />} path="/*" />
			</Routes>

			<Footer />
		</BlogProvider>
	);
}

export default App;
