// Import necessary modules
const express = require('express')
const multer = require('multer')

// Variable to store current player information
let player = null

// Function to get the current player
const getCurrentPlayer = () => player

// Create an Express app
const app = express()
app.use(multer().array())

// Function to set up the server
const setupServer = () => {
	// Serve static files from the 'public' directory
	app.use(express.static('public'))

	// Handle POST requests to '/player' endpoint
	app.post('/player', async (req, res) => {
		// Extract player information from the request body
		player = Object.fromEntries(Object.entries(req.body))
		// Respond with a status code 201 (Created)
		res.sendStatus(201)
	})

	// Start the server on port 8000
	app.listen(8000)
}

// Export the setupServer function and getCurrentPlayer function
module.exports = {
	setupServer,
	getCurrentPlayer
}
