function formattedDate(value, type) {
	let date = new Date(value);
	let options;

	if (type === "long") {
		options = {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
		};
	} else if (type === "short") {
		options = {
			year: "numeric",
			month: "short",
			day: "numeric",
		};
	} else if (type === "hour") {
		options = {
			hour: "numeric",
			minute: "numeric",
		};
	}

	return Intl.DateTimeFormat("en-us", options).format(date);
}

export { formattedDate };
