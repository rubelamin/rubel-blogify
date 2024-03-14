import { Link } from "react-router-dom";
import CommentIcon from "../../assets/icons/comment.svg";

import FavouriteIcon from "../common/FavouriteIcon";
import LikesCounterIcon from "../common/LikesCounterIcon";

export default function FloatingButton({ details, scrollToComments }) {
	return (
		<div className="floating-action">
			<ul className="floating-action-menus">
				<li>
					<LikesCounterIcon details={details} />
				</li>
				<li>
					<FavouriteIcon details={details} />
				</li>
				<Link to="#" onClick={scrollToComments}>
					<li>
						<img src={CommentIcon} alt="Comments" />
						<span>{details?.comments?.length}</span>
					</li>
				</Link>
			</ul>
		</div>
	);
}
