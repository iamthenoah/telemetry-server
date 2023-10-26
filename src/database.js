const { Database } = require('sqlite3')
const path = require('path')
const fs = require('fs')

const output = path.join(process.cwd(), 'database.sqlite')
!fs.existsSync(output) && fs.createWriteStream(output)

const database = new Database(output)

const setupDatabase = () => {
	createTable('classification', {
		sessionUID: 'BIGINT',
		position: 'TINYINT',
		numLaps: 'TINYINT',
		gridPosition: 'TINYINT',
		points: 'TINYINT',
		numPitStops: 'TINYINT',
		resultStatus: 'TINYINT',
		bestLapTimeInMS: 'UINT32',
		totalRaceTime: 'DOUBLE',
		penaltiesTime: 'TINYINT',
		numPenalties: 'TINYINT',
		numTyreStints: 'TINYINT',
		tyreStintsActual: 'TINYINT',
		tyreStintsVisual: 'TINYINT',
		tyreStintsEndLaps: 'TINYINT'
	})

	createTable('telemetry', {
		sessionUID: 'BIGINT',
		speed: 'SMALLINT',
		throttle: 'FLOAT',
		steer: 'FLOAT',
		brake: 'FLOAT',
		clutch: 'TINYINT',
		gear: 'TINYINT',
		engineRPM: 'SMALLINT',
		drs: 'TINYINT',
		revLightsPercent: 'TINYINT',
		revLightsBitValue: 'SMALLINT',
		brakesTemperature: 'SMALLINT',
		tyresSurfaceTemperature: 'TINYINT',
		tyresInnerTemperature: 'TINYINT',
		engineTemperature: 'SMALLINT',
		tyresPressure: 'FLOAT',
		surfaceType: 'TINYINT'
	})

	createTable('participants', {
		sessionUID: 'BIGINT',
		aiControlled: 'TINYINT',
		driverId: 'TINYINT',
		networkId: 'TINYINT',
		teamId: 'TINYINT',
		myTeam: 'TINYINT',
		raceNumber: 'TINYINT',
		nationality: 'TINYINT',
		name: 'TEXT',
		yourTelemetry: 'TINYINT'
	})
}

const createTable = (table, columns) => {
	const entries = Object.entries(columns)
		.map(([key, value]) => `${key} ${value}`)
		.join(', ')

	const sql = `CREATE TABLE IF NOT EXISTS ${table} (id INTEGER PRIMARY KEY, created TIMESTAMP, ${entries})`

	database.run(sql)
}

const getOne = async (table, params) => {
	return new Promise((resolve, reject) => {
		const values = Object.values(params)
		const keys = Object.keys(params)
			.map(key => key + ' = ?')
			.join(' AND ')

		const sql = `SELECT * FROM ${table} WHERE ${keys}`

		database.get(sql, values, (error, result) => {
			error ? reject(error) : resolve(result)
		})
	})
}

const getAll = (table, page, count) => {
	return new Promise((resolve, reject) => {
		const sql = `SELECT * FROM ${table} LIMIT ? OFFSET ?`

		database.all(sql, [count, (page - 1) * count], (error, results) => {
			error ? reject(error) : resolve(results)
		})
	})
}

const insertOne = (table, params) => {
	return new Promise((resolve, reject) => {
		const values = Object.values(params)
		const keys = Object.keys(params).join(',')
		const num = Object.keys(params)
			.map(() => '?')
			.join(',')

		const sql = `INSERT INTO ${table} (created, ${keys}) VALUES (?, ${num})`

		const insert = database.prepare(sql)
		insert.run(Date.now(), ...values, async error => {
			error ? reject(error) : resolve(await getOne(table, params))
		})
		insert.finalize()
	})
}

const getTables = async () => {
	return new Promise((resolve, reject) => {
		database.serialize(() => {
			const sql = "SELECT * FROM sqlite_master WHERE type='table'"

			database.all(sql, async (error, tables) => {
				if (error) {
					reject(error)
				} else {
					const info = []

					for (const { name, sql } of tables) {
						const regex = /([a-zA-Z_][a-zA-Z0-9_]*)\s+(\w+)(?:,|$)/g
						const columns = {}
						columns['id'] = 'INTEGER'

						let match
						while ((match = regex.exec(sql)) !== null) {
							columns[match[1]] = match[2]
						}

						delete columns['PRIMARY']
						info.push({ name, columns })
					}
					resolve(info)
				}
			})
		})
	})
}

module.exports = {
	setupDatabase,
	getOne,
	getAll,
	insertOne,
	getTables
}
