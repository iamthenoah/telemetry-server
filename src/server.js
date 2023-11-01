const { getTables, getAll } = require('./database')
const express = require('express')
const json2csv = require('json2csv')
const multer = require('multer')

const app = express()
app.use(multer().array())

let player = null

const setupServer = () => {
	app.use(express.static('public'))

	app.get('/table', async (_, res) => {
		try {
			res.json(await getTables())
		} catch (error) {
			res.status(500).json({ error: error.message })
		}
	})

	app.get('/table/:table', async (req, res) => {
		try {
			const file = req.query.file
			const table = req.params.table
			const page = req.query.page || 1
			const count = req.query.count || 10

			const data = await getAll(table, page, count)

			if (file === 'csv') {
				const csv = json2csv.parse(data)
				res.header('Content-Type', 'text/csv')
				res.attachment(`${table}.csv`)
				res.send(csv)
			} else {
				res.json(data)
			}
		} catch (error) {
			res.status(500).json({ error: error.message })
		}
	})

	app.post('/player', (req, res) => {
		player = Object.fromEntries(Object.entries(req.body))
		res.sendStatus(201)
	})

	app.listen(8000)
}

module.exports = {
	setupServer
}
