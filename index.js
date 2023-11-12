const { setupDatabase } = require('./src/database')
const { setupServer } = require('./src/server')
const { setupTelemetry } = require('./src/telemetry')

const main = async () => {
	console.group('Setting up database.')
	await setupDatabase()
	console.log('Done.')
	console.groupEnd()

	console.group('Setting up http server.')
	setupServer()
	console.log('Done.')
	console.groupEnd()

	console.group('Setting up telemetry.')
	setupTelemetry()
	console.log('Done.')
	console.groupEnd()

	console.log('\nReady for F122...')
}

main()
