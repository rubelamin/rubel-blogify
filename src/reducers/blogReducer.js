import { actions } from "../actions/index";

const initialState = {
	blogs: [],
	singleBlog: {},
	blogComments: [],
	loading: false,
	error: null,
};

const blogReducer = (state, action) => {
	switch (action.type) {
		case actions.blog.DATA_FETCHING:
			return {
				...state,
				loading: true,
			};

		case actions.blog.DATA_FETCHED:
			return {
				...state,
				loading: false,
				blogs: [...state.blogs, ...action.data],
			};

		case actions.blog.DATA_ERROR:
			return {
				...state,
				loading: false,
				error: action.error,
			};

		case actions.blog.DATA_CLEAN:
			return {
				...state,
				loading: false,
				error: null,
				blogs: [],
			};

		case actions.blog.BLOG_CREATED:
			return {
				...state,
				loading: false,
				error: null,
				blogs: [...state.blogs, action.data],
			};

		case actions.blog.BLOG_DELETED: {
			const blg = state.blogs.filter(
				(item) => item.id !== action.payload.blogId
			);
			return {
				...state,
				loading: false,
				error: null,
				blogs: blg,
			};
		}

		case actions.singleBlog.DATA_FETCHED:
			return {
				...state,
				loading: false,
				singleBlog: action.payload,
				blogComments: [...action.payload.comments],
			};

		case actions.singleBlog.BLOG_COMMENTS:
			return {
				...state,
				loading: false,
				blogComments: [
					{
						blogId: action.payload.blogId,
						comments: action.payload.comments,
					},
				],
			};

		case actions.singleBlog.COMMENT_DELETE: {
			const bc = state.blogComments.filter(
				(cc) => cc.id !== action.payload.blogId
			);
			return {
				...state,
				loading: false,
				blogComments: bc,
			};
		}
		case actions.singleBlog.BLOG_FAVOURITED: {
			return {
				...state,
				loading: false,
				singleBlog: {
					...state.singleBlog,
					isFavourite: action.data,
				},
			};
		}
		case actions.singleBlog.BLOG_LIKED: {
			return {
				...state,
				loading: false,
				singleBlog: {
					...state.singleBlog,
					likes: [...action.data],
				},
			};
		}

		default:
			return state;
	}
};

export { blogReducer, initialState };
