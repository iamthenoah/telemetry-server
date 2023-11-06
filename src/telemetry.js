const { F122UDP } = require('f1-22-udp')
const { insertOne } = require('./database')
const { getCurrentPlayer } = require('./server')

const f122 = new F122UDP()

const setupTelemetry = () => {
	f122.start()

	handle('carTelemetry', 'm_carTelemetryData', 'telemetry')
	handle('participants', 'm_participants', 'participants')
}

const handle = (name, property, table) => {
	f122.on(name, async event => {
		const { m_sessionUID } = event.m_header
		const value = event[property]

		const player = getCurrentPlayer()

		if (Array.isArray(value)) {
			for (const row of value) {
				await insertOne(table, flatten({ m_sessionUID, ...row, playerId: player.id }))
			}
		} else {
			await insertOne(table, flatten({ m_sessionUID, ...value, playerId: player.id }))
		}
	})
}

const flatten = data => {
	var object = {}

	for (const key in data) {
		if (typeof data[key] === 'object' && data[key] !== null) {
			const flat = flatten(data[key])

			for (const x in flat) {
				object[key + '_' + x] = flat[x]
			}
		} else {
			object[key] = data[key]
		}
	}
	return object
}

module.exports = {
	setupTelemetry
}
