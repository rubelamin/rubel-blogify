/* eslint-disable react/prop-types */
import BlogCard from "./BlogCard";

export default function BlogContent({ blogs }) {
	return (
		<div className="space-y-3 md:col-span-5">
			{blogs.map((blog) => (
				<BlogCard blog={blog} key={blog.id} />
			))}
		</div>
	);
}
