const { F122UDP } = require('f1-22-udp')
const { select, insert } = require('./database')
const { getCurrentPlayer } = require('./server')

const f122 = new F122UDP()

const setupTelemetry = () => {
	f122.start()

	f122.on('motion', async event => {
		const { m_header, m_carMotionData, ...reset } = event

		const { m_suspensionPosition, m_suspensionVelocity, m_suspensionAcceleration, ...data } = reset
		const [suspensionPositionRL, suspensionPositionRR, suspensionPositionFL, suspensionPositionFR] = m_suspensionPosition
		const [suspensionVelocityRL, suspensionVelocityRR, suspensionVelocityFL, suspensionVelocityFR] = m_suspensionVelocity
		const [suspensionAccelerationRL, suspensionAccelerationRR, suspensionAccelerationFL, suspensionAccelerationFR] = m_suspensionAcceleration

		const params = {
			...data,
			suspensionPositionRL,
			suspensionPositionRR,
			suspensionPositionFL,
			suspensionPositionFR,
			suspensionVelocityRL,
			suspensionVelocityRR,
			suspensionVelocityFL,
			suspensionVelocityFR,
			suspensionAccelerationRL,
			suspensionAccelerationRR,
			suspensionAccelerationFL,
			suspensionAccelerationFR
		}

		await handleInsert('motion', m_header, params)
	})

	f122.on('session', async event => {
		const { m_header, m_marshalZones, m_weatherForecastSamples, m_numWeatherForecastSamples, ...params } = event
		await handleInsert('session', m_header, params)
	})

	f122.on('finalClassification', async event => {
		const { m_header, m_classificationData } = event

		for (const car of m_classificationData) {
			delete car['m_tyreStintsActual']
			delete car['m_tyreStintsVisual']
			delete car['m_tyreStintsEndLaps']

			await handleInsert('classification', m_header, car)
		}
	})
}

const handleInsert = async (table, header, params) => {
	const { m_sessionUID: sessionUID, m_sessionTime: sessionTime } = header

	if (await select('player', { sessionUID })) {
		await insert('player', { ...getCurrentPlayer(), sessionUID })
	}

	const data = Object.entries(params).map(([key, value]) => [key.replace(/^m_/, ''), value])
	await insert(table, { sessionUID, sessionTime, ...data })
}

module.exports = {
	setupTelemetry
}
