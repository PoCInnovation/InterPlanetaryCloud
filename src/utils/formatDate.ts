const formatDate = (date: number): string => {
	const dateObject = new Date(date);
	return dateObject.toLocaleDateString('en-UK', { year: 'numeric', month: 'short', day: '2-digit' });
};

export default formatDate;
