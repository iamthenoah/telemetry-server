const { setupDatabase } = require('./src/database')
const { setupServer } = require('./src/server')
const { setupTelemetry } = require('./src/telemetry')

setupDatabase()
setupServer()
setupTelemetry()
