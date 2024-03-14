import { useState } from "react";
import { api } from "../api";
import closeIcon from "../assets/icons/close.svg";
import useDebounce from "../hooks/useDebounce";
import SearchBlogCard from "./blogs/SearchBlogCard";
import Loading from "./common/Loading";

export default function SearchModal({ setShowSearchModal }) {
	const [searchText, setSearchText] = useState("");
	const [searchedBlog, setSearchedBlog] = useState([]);
	const [searchError, setSearchError] = useState(null);
	const [seaching, setSearching] = useState(false);

	const handleSearch = useDebounce((terms) => {
		const fetchSearch = async () => {
			setSearching(true);
			try {
				const response = await api.get(`/search?q=${terms}`);
				if (response.status === 200) {
					setSearchedBlog(response.data.data);
				} else if (response.status === 404) {
					setSearchedBlog([]);
				}
			} catch (error) {
				console.log(error);
				setSearchedBlog([]);
				setSearchError(
					"There is an error to search your terms of blog"
				);
			} finally {
				setSearching(false);
			}
		};
		fetchSearch();
	}, 500);

	const handleSeachChange = (e) => {
		const value = e.target.value;

		setSearchText(value);
		handleSearch(value);
	};

	const clearSearchField = () => {
		setSearchText("");
	};

	console.log(searchedBlog);
	console.log(searchError);

	return (
		<div className=" fixed inset-0 z-50 h-full overflow-y-auto min-h-screen">
			<section className="absolute left-0 top-0 w-full h-full grid place-items-center bg-slate-800/50 backdrop-blur-sm z-50">
				<div className="relative w-6/12 mx-auto bg-slate-900 p-4 border border-slate-600/50 rounded-lg shadow-lg shadow-slate-400/10">
					<div>
						<h3 className="font-bold text-xl pl-2 text-slate-400 my-2">
							Search for Your Desire Blogs
						</h3>
						<input
							type="text"
							placeholder="Start Typing to Search"
							className="w-full bg-transparent p-2 text-base text-white outline-none border-none rounded-lg focus:ring focus:ring-indigo-600"
							value={searchText}
							onChange={handleSeachChange}
							onBlur={clearSearchField}
						/>
					</div>
					<div className="">
						{seaching && (
							<div className="flex items-center my-2 w-full">
								<Loading />
							</div>
						)}
						{searchedBlog?.length > 0 && (
							<h3 className="text-slate-400 font-bold mt-6">
								Search Results
							</h3>
						)}

						<div className="my-4 divide-y-2 divide-slate-500/30 max-h-[440px] overflow-y-scroll overscroll-contain">
							{searchedBlog?.length > 0 ? (
								<>
									{searchedBlog.map((blog) => (
										<SearchBlogCard
											key={blog.id}
											blog={blog}
											setShowSearchModal={
												setShowSearchModal
											}
										/>
									))}
								</>
							) : (
								""
							)}
						</div>
					</div>
					<button onClick={() => setShowSearchModal(false)}>
						<img
							src={closeIcon}
							alt="Close"
							className="absolute right-2 top-2 cursor-pointer w-8 h-8"
						/>
					</button>
				</div>
			</section>
		</div>
	);
}
