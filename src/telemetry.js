const { F122UDP } = require('f1-22-udp')
const { insertOne } = require('./database')

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

		if (Array.isArray(value)) {
			for (const row of value) {
				await insertOne(table, sanitize({ m_sessionUID, ...row }))
			}
		} else {
			await insertOne(table, sanitize({ m_sessionUID, ...value }))
		}
	})
}

const sanitize = data => {
	return Object.keys(data).reduce((obj, key) => {
		obj[key.replace('m_', '')] = data[key]
		return obj
	}, {})
}

module.exports = {
	setupTelemetry
}
