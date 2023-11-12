const { getTables, insertOne } = require('./database')
const express = require('express')
const multer = require('multer')
const uuid = require('uuid')

const app = express()
app.use(multer().array())

let player = null

const getCurrentPlayer = () => player

const setupServer = () => {
	app.use(express.static('public'))

	app.get('/table', async (_, res) => {
		try {
			res.json(await getTables())
		} catch (error) {
			res.status(500).json({ error: error.message })
		}
	})

	app.post('/player', async (req, res) => {
		player = { playerId: uuid.v4(), ...Object.fromEntries(Object.entries(req.body)) }
		await insertOne('player', player)
		res.sendStatus(201)
	})

	app.listen(8000)
}

module.exports = {
	setupServer,
	getCurrentPlayer
}
