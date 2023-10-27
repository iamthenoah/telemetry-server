const express = require('express')
const xlsx = require('xlsx')
const json2csv = require('json2csv')
const { getTables, getAll } = require('./database')

const app = express()

const setupServer = () => {
	app.get('/', (_, res) => {
		res.sendStatus(200)
	})

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

			if (file === 'csv' || file === 'xlsx') {
				if (file === 'csv') {
					const csv = json2csv.parse(data)
					res.header('Content-Type', 'text/csv')
					res.attachment(`${table}.csv`)
					res.send(csv)
				} else if (file === 'xlsx') {
					const ws = xlsx.utils.json_to_sheet(data)
					const wb = xlsx.utils.book_new()
					xlsx.utils.book_append_sheet(wb, ws, table)
					xlsx.writeFile(wb, `${table}.xlsx`)
					res.download(`${table}.xlsx`)
				}
			} else {
				res.json(data)
			}
		} catch (error) {
			res.status(500).json({ error: error.message })
		}
	})

	app.listen(8000)
}

module.exports = {
	setupServer
}
