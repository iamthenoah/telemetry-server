// Import necessary modules
const { F122UDP } = require('f1-22-udp')
const { insert } = require('./database')
const { getCurrentPlayer } = require('./server')

// Function to introduce a sleep delay
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

// Create an instance of F122UDP with provided address and port
const f122 = new F122UDP({
	address: process.env.F122_HOST,
	port: process.env.F122_PORT
})

// Function to set up telemetry
const setupTelemetry = () => {
	// Start listening for F122 events
	f122.start()

	// Handle the 'event' (event) F122UDP event
	f122.on('event', async event => {
		// Check if the event code is 'SSTA' (Session Started)
		if (event.m_eventStringCode === 'SSTA') {
			const player = getCurrentPlayer()

			if (player) {
				const sessionUID = event.m_header.m_sessionUID
				// Insert player information into the database
				await insert('player', { ...player, sessionUID })

				console.log('Session started with player:', player)
			} else {
				console.log('Session started without a player.')
			}
		}
	})

	// Handle the 'motion' (motion) F122UDP event
	f122.on('motion', async event => {
		// Extract necessary parameters
		const { m_header, m_carMotionData } = event
		const params = m_carMotionData[m_header.m_playerCarIndex]

		// Insert motion data into the database
		await handleInsert('motion', m_header, params)
	})

	// Handle the 'carTelemetry' (car telemetry) F122UDP event
	f122.on('carTelemetry', async event => {
		// Extract necessary parameters
		const { m_header, m_carTelemetryData } = event
		const params = m_carTelemetryData[m_header.m_playerCarIndex]

		// Flatten and insert telemetry data into the database
		flattenTyreData('m_brakesTemperature', params)
		flattenTyreData('m_tyresSurfaceTemperature', params)
		flattenTyreData('m_tyresInnerTemperature', params)
		flattenTyreData('m_tyresPressure', params)
		flattenTyreData('m_surfaceType', params)

		await handleInsert('telemetry', m_header, params)
	})

	// Handle the 'lapData' (lap data) F122UDP event
	f122.on('lapData', async event => {
		// Extract necessary parameters
		const { m_header, m_lapData } = event
		const params = m_lapData[m_header.m_playerCarIndex]

		// Insert lap data into the database
		await handleInsert('telemetry', m_header, params)
	})

	// Handle the 'session' (session) F122UDP event
	f122.on('session', async event => {
		// Extract necessary parameters
		const { m_header, ...params } = event
		// Remove unnecessary fields
		delete params['m_marshalZones']
		delete params['m_weatherForecastSamples']
		delete params['m_numWeatherForecastSamples']

		// Insert session data into the database
		await handleInsert('session', m_header, params)
	})

	// Handle the 'finalClassification' (final classification) F122UDP event
	f122.on('finalClassification', async event => {
		// Extract necessary parameters
		const { m_header, m_classificationData } = event

		// Loop through classification data and insert into the database
		for (let i = 0; i < m_classificationData.length; i++) {
			const car = m_classificationData[i]
			// Remove unnecessary fields
			delete car['m_tyreStintsActual']
			delete car['m_tyreStintsVisual']
			delete car['m_tyreStintsEndLaps']

			// Add a flag for the player car
			car['isPlayer'] = i === m_header.m_playerCarIndex
			// Insert classification data into the database
			await handleInsert('classification', m_header, car)
		}
	})
}

// Function to flatten tyre data
const flattenTyreData = (key, params) => {
	const data = params[key]
	delete params[key]

	// Create individual keys for each tyre
	params[key + 'RearLeft'] = data[0]
	params[key + 'RearRight'] = data[1]
	params[key + 'FrontLeft'] = data[2]
	params[key + 'FrontRight'] = data[3]
}

// Function to handle data insertion
const handleInsert = async (table, header, params) => {
	const { m_sessionUID: sessionUID, m_sessionTime: sessionTime } = header

	const data = {}
	for (const [key, value] of Object.entries(params)) {
		data[key.replace('m_', '')] = value
	}

	// Insert data into the database and introduce a delay
	await insert(table, { sessionUID, sessionTime, ...data })
	await sleep(1000)
}

// Export the setupTelemetry function
module.exports = {
	setupTelemetry
}
