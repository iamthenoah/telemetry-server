document.getElementById('PlayerForm').addEventListener('submit', async event => {
	event.preventDefault()
	const body = new FormData(event.target)
	fetch('/player', { method: 'POST', body }).then(console.log)
})
