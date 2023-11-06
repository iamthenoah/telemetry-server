const Nosql = require('nosql')
const path = require('path')
const fs = require('fs')

const databases = {}

const setupDatabase = () => {
	const dir = path.join(process.cwd(), 'databases')

	for (const file of fs.readdirSync(dir)) {
		if (file.endsWith('.nosql')) {
			getTable(path.parse(file).name)
		}
	}
}

const getTable = table => {
	if (databases[table]) {
		return databases[table]
	}

	const dir = path.join(process.cwd(), 'databases')
	!fs.existsSync(dir) && fs.mkdirSync(dir)

	const filename = path.join(dir, `${table}.nosqldb`)
	const database = Nosql.load(filename)
	databases[table] = database

	return database
}

const getTables = () => {
	return Object.keys(databases)
}

const getOne = (table, params) => {
	const database = getTable(table)

	return new Promise((resolve, reject) => {
		database.one().make(builder => {
			builder.where(params)
			builder.callback((error, result) => {
				error ? reject(error) : resolve(result)
			})
		})
	})
}

const getAll = table => {
	const database = getTable(table)

	return new Promise((resolve, reject) => {
		database.find().make(builder => {
			builder.callback((error, result) => {
				error ? reject(error) : resolve(result)
			})
		})
	})
}

const insertOne = (table, params) => {
	const database = getTable(table)

	return new Promise((resolve, reject) => {
		database.insert(params).callback((error, result) => {
			error ? reject(error) : resolve(result)
		})
	})
}

module.exports = {
	setupDatabase,
	getTable,
	getOne,
	getAll,
	insertOne,
	getTables
}
