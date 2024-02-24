document.addEventListener('DOMContentLoaded', () => {
	const form = document.getElementById('form');

	form.onsubmit = async (event) => {
		event.preventDefault();

		try {
			const res = await fetch('/api/users', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					username: form.username.value,
					email: form.email.value
				})
			});
			const json = await res.json();
		} catch (error) {
			console.log(error);
		}
	};
});