import { api } from "../api";

export const getBlogDetails = async (id) => {
	const response = await api.get(`/blogs/${id}`);

	return response.data;
};

export const URLtoFile = async (url) => {
	const res = await fetch(url);
	const blob = await res.blob();

	const mime = blob.type;
	const ext = mime.slice(mime.lastIndexOf("/") + 1, mime.length);

	const timeInMilSec = new Date().getTime();
	const file = new File([blob], `${timeInMilSec}thumb.${ext}`, {
		type: mime,
	});

	return file;
};
