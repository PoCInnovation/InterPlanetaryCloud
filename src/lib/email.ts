const sendContactForm = async (data: object) =>
	fetch('/api/email', {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
	}).then((res) => {
		if (!res.ok) throw new Error('Failed to send message');
		return res.json();
	});

export default sendContactForm;
