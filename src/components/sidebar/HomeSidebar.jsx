import { useAuth } from "../../hooks/useAuth";
import FavoriteSidebar from "./FavoriteSidebar";
import MostPopular from "./MostPopular";

export default function HomeSidebar() {
	const { auth } = useAuth();

	return (
		<div className="md:col-span-2 h-full w-full space-y-5">
			<MostPopular />

			{auth?.user && <FavoriteSidebar />}
		</div>
	);
}
