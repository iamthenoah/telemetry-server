const parser = require('body-parser')
const express = require('express')
const { getTables, getAll } = require('./database')

const app = express()
app.use(parser.json())

const setupServer = () => {
	app.get('/', (_, res) => {
		res.sendStatus(200)
	})

	app.get('/tables', async (_, res) => {
		try {
			res.json(await getTables())
		} catch (error) {
			res.status(500).json({ error: error.message })
		}
	})

	app.get('/table/:table', async (req, res) => {
		try {
			const page = req.query.page || 1
			const count = req.query.count || 10
			res.json(await getAll(req.params.table, page, count))
		} catch (error) {
			res.status(500).json({ error: error.message })
		}
	})

	app.listen(8000)
}

module.exports = {
	setupServer
}
