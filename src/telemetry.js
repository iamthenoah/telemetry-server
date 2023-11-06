const { F122UDP } = require('f1-22-udp')
const { insertOne } = require('./database')
const { getCurrentPlayer } = require('./server')

const f122 = new F122UDP()

const setupTelemetry = () => {
	f122.start()

	handle('carDamage', 'm_carDamageData')
	handle('carSetups', 'm_carSetupsData')
	handle('carStatus', 'm_carStatusData')
	handle('event', 'm_eventData')
	handle('finalClassification', 'm_finalClassificationData')
	handle('lapData', 'm_lapDataData')
	handle('lobbyInfo', 'm_lobbyInfoData')
	handle('motion', 'm_motionData')
	handle('session', 'm_sessionData')
	handle('carTelemetry', 'm_carTelemetryData')
	handle('sessionHistory', 'm_sessionHistoryData')
	handle('participants', 'm_participants')
}

const handle = (name, property) => {
	f122.on(name, async event => {
		const { m_sessionUID } = event.m_header
		// const value = event[property]
		const value = event

		const player = getCurrentPlayer()

		if (Array.isArray(value)) {
			for (const row of value) {
				await insertOne(name, flatten({ m_sessionUID, ...row, playerId: player.id }))
			}
		} else {
			await insertOne(name, flatten({ m_sessionUID, ...value, playerId: player.id }))
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
