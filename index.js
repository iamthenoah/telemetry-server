// Load environment variables from .env file
require('dotenv').config()

// Import setup functions from different modules
const { setupDatabase } = require('./src/database')
const { setupServer } = require('./src/server')
const { setupTelemetry } = require('./src/telemetry')

// Main function to initialize the application
const main = async () => {
	// Setting up the database
	console.group('Setting up database.')
	await setupDatabase()
	console.log('Done.')
	console.groupEnd()

	// Setting up the HTTP server
	console.group('Setting up HTTP server.')
	setupServer()
	console.log('Done.')
	console.groupEnd()

	// Setting up telemetry
	console.group('Setting up telemetry.')
	setupTelemetry()
	console.log('Done.')
	console.groupEnd()

	// Display a message indicating readiness for F122
	console.log('\nReady for F122...')
}

// Call the main function to start the application setup
main()
