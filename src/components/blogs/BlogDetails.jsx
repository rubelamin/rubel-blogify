import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ErrorBoundary } from "react-error-boundary";
import { actions } from "../../actions";
import { api } from "../../api";
import { useBlog } from "../../hooks/useBlog";
import Loading from "../common/Loading";
import FloatingButton from "./FloatingButton";
import PostedOnBy from "./PostedOnBy";
import ShowComments from "./ShowComments";
import WriteComment from "./WriteComment";

export default function BlogDetails() {
	const { blogId } = useParams();
	const { state, dispatch } = useBlog();
	const navigate = useNavigate();
	// const [details, setDetails] = useState({});

	const commentsRef = useRef(null);

	useEffect(() => {
		const fetchDetails = async (id) => {
			dispatch({
				type: actions.blog.DATA_FETCHING,
			});
			try {
				const response = await api.get(`/blogs/${id}`);
				if (response.status === 200) {
					dispatch({
						type: actions.singleBlog.DATA_FETCHED,
						payload: { ...response.data },
					});
					// setDetails(state?.singleBlog);
				}
			} catch (error) {
				if (error.response.status === 404) {
					navigate("/notfound");
				}
			}
		};

		fetchDetails(blogId);
	}, [blogId, dispatch, navigate]);

	const scrollToComments = () => {
		commentsRef.current.scrollIntoView({ behavior: "smooth" });
	};

	return (
		<>
			{Object.keys(state?.singleBlog || {}).length !== 0 ? (
				<ErrorBoundary
					fallback={<div>Blog details fetching error!</div>}
				>
					<main>
						{/* Begin Blogs */}
						<section>
							<div className="container text-center py-8">
								<h1 className="font-bold text-3xl md:text-5xl">
									{state?.singleBlog?.title}
								</h1>

								<PostedOnBy details={state?.singleBlog} />
								<img
									className="mx-auto w-full md:w-8/12 object-cover h-80 md:h-96"
									src={`${
										import.meta.env.VITE_BASE_SERVER_URL
									}/uploads/blog/${
										state?.singleBlog?.thumbnail
									}`}
									alt={state?.singleBlog?.title}
								/>

								{/* Tags */}
								<ul className="tags capitalize">
									{state?.singleBlog?.tags
										?.split(",")
										.map((tag) => (
											<li key={tag}>{tag}</li>
										))}
								</ul>

								{/* Content */}
								<div className="mx-auto w-full md:w-10/12 text-slate-300 text-base md:text-lg leading-8 py-2 !text-left">
									{state?.singleBlog?.content}
								</div>
							</div>
						</section>
						{/* End Blogs */}

						{/* Begin Comments */}
						<section id="comments" ref={commentsRef}>
							<div className="mx-auto w-full md:w-10/12 container">
								<h2 className="text-3xl font-bold my-8">
									Comments (
									{state?.singleBlog?.comments?.length})
								</h2>

								<WriteComment details={state?.singleBlog} />

								{state?.singleBlog?.comments?.length > 0 && (
									<ShowComments />
								)}
							</div>
						</section>
					</main>

					{/* Floating Actions*/}
					<FloatingButton
						details={state?.singleBlog}
						scrollToComments={scrollToComments}
					/>
				</ErrorBoundary>
			) : (
				<div className="flex w-full h-screen justify-center items-center">
					<Loading />
				</div>
			)}
		</>
	);
}
