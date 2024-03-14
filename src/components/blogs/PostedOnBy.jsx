import { Link } from "react-router-dom";
import { formattedDate } from "../../utils/date-utils";

export default function PostedOnBy({ details }) {
	return (
		<div className="flex justify-center items-center my-4 gap-4">
			<div className="flex items-center capitalize space-x-2">
				<div className="avater-img bg-indigo-600 text-white">
					<Link to={`/author/${details?.author?.id}`}>
						{details?.author?.avatar ? (
							<img
								src={`${
									import.meta.env.VITE_BASE_SERVER_URL
								}/uploads/avatar/${details?.author?.avatar}`}
								alt={details?.author?.firstName}
								className="border-2 border-gray-400 rounded-full"
							/>
						) : (
							<span className="">
								{details.author?.firstName?.charAt(0)}
							</span>
						)}
					</Link>
				</div>
				<Link to={`/author/${details?.author?.id}`}>
					<h5 className="text-slate-500 text-sm">
						{details?.author?.firstName +
							" " +
							details?.author?.lastName}
					</h5>
				</Link>
			</div>
			<span className="text-sm text-slate-700 dot">
				{details?.createdAt &&
					formattedDate(details?.createdAt, "short")}
			</span>
			<span className="text-sm text-slate-700 dot">
				{details?.likes?.length} Likes
			</span>
		</div>
	);
}
