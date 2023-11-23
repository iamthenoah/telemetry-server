const mysql = require('mysql')
const path = require('path')
const fs = require('fs')

const database = mysql.createConnection({
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	user: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD
})

const setupDatabase = async () => {
	const tables = path.resolve(process.cwd(), 'tables')

	for (const file of fs.readdirSync(tables)) {
		const ext = path.extname(file)

		if (ext == '.json') {
			await createTable(file.replace(ext, ''), require(path.resolve(tables, file)))
		}
	}
}

const createTable = async (table, params) => {
	const columns = Object.entries(params)
		.map(([key, type]) => key + ' ' + type)
		.join(', ')

	await execute(`CREATE TABLE IF NOT EXISTS ${table} (${columns})`)
}

const insert = async (table, params) => {
	const keys = Object.keys(params).join(', ')
	const values = Object.values(params).map(mysql.escape).join(', ')

	return await execute(`INSERT INTO ${table} (${keys}) VALUES (${values})`)
}

const execute = query => {
	return new Promise((resolve, reject) => {
		database.query(query, (error, results) => {
			error ? reject(error) : resolve(results)
		})
	})
}

module.exports = {
	setupDatabase,
	insert
}
