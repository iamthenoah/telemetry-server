const { F122UDP } = require('f1-22-udp')
const { insert } = require('./database')
const { getCurrentPlayer } = require('./server')

const f122 = new F122UDP()

const setupTelemetry = () => {
	f122.start()

	f122.on('event', async event => {
		if (event.m_eventStringCode === 'SSTA') {
			const player = getCurrentPlayer()

			if (player) {
				const sessionUID = event.m_header.m_sessionUID
				await insert('player', { ...player, sessionUID })

				console.log('Session started with player:', player)
			} else {
				console.log('Session started without a player.')
			}
		}
	})

	f122.on('motion', async event => {
		const { m_header, m_carMotionData } = event
		const params = m_carMotionData[m_header.m_playerCarIndex]

		await handleInsert('motion', m_header, params)
	})

	f122.on('carTelemetry', async event => {
		const { m_header, m_carTelemetryData } = event
		const params = m_carTelemetryData[m_header.m_playerCarIndex]

		flattenTyreData('m_brakesTemperature', params)
		flattenTyreData('m_tyresSurfaceTemperature', params)
		flattenTyreData('m_tyresInnerTemperature', params)
		flattenTyreData('m_tyresPressure', params)
		flattenTyreData('m_surfaceType', params)

		await handleInsert('telemetry', m_header, params)
	})

	f122.on('lapData', async event => {
		const { m_header, m_lapData } = event
		const params = m_lapData[m_header.m_playerCarIndex]

		await handleInsert('telemetry', m_header, params)
	})

	f122.on('session', async event => {
		const { m_header, ...params } = event
		delete params['m_marshalZones']
		delete params['m_weatherForecastSamples']
		delete params['m_numWeatherForecastSamples']

		await handleInsert('session', m_header, params)
	})

	f122.on('finalClassification', async event => {
		const { m_header, m_classificationData } = event

		for (let i = 0; i < m_classificationData.length; i++) {
			const car = m_classificationData[i]
			delete car['m_tyreStintsActual']
			delete car['m_tyreStintsVisual']
			delete car['m_tyreStintsEndLaps']

			car['isPlayer'] = i === m_header.m_playerCarIndex
			await handleInsert('classification', m_header, car)
		}
	})
}

const flattenTyreData = (key, params) => {
	const data = params[key]
	delete params[key]

	params[key + 'RearLeft'] = data[0]
	params[key + 'RearRight'] = data[1]
	params[key + 'FrontLeft'] = data[2]
	params[key + 'FrontRight'] = data[3]
}

const handleInsert = async (table, header, params) => {
	const { m_sessionUID: sessionUID, m_sessionTime: sessionTime } = header
	const data = {}
	Object.entries(params).forEach(([key, value]) => (data[key.replace('m_', '')] = value))
	await insert(table, { sessionUID, sessionTime, ...data })
}

module.exports = {
	setupTelemetry
}
