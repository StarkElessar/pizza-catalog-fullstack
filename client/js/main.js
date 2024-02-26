document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#form');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({
                    username: form.username.value,
                    email: form.email.value,
                }),
            });
            const json = await res.json();
            console.log(json);
        } catch (error) {
            console.log(error);
        }
    });
});
