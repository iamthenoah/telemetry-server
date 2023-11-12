const express = require('express')
const multer = require('multer')

let player = null

const getCurrentPlayer = () => player

const app = express()
app.use(multer().array())

const setupServer = () => {
	app.use(express.static('public'))

	app.post('/player', async (req, res) => {
		player = Object.fromEntries(Object.entries(req.body))
		res.sendStatus(201)
	})

	app.listen(8000)
}

module.exports = {
	setupServer,
	getCurrentPlayer
}
