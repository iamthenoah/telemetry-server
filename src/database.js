const mysql = require('mysql')

const database = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'admin',
	database: 'database'
})

const player = {
	sessionUID: 'FLOAT',
	firstName: 'TEXT',
	lastName: 'TEXT',
	country: 'TEXT'
}

const motion = {
	sessionUID: 'FLOAT',
	sessionTime: 'FLOAT',
	worldPositionX: 'FLOAT',
	worldPositionY: 'FLOAT',
	worldPositionZ: 'FLOAT',
	worldVelocityX: 'FLOAT',
	worldVelocityY: 'FLOAT',
	worldVelocityZ: 'FLOAT',
	worldForwardDirX: 'SMALLINT',
	worldForwardDirY: 'SMALLINT',
	worldForwardDirZ: 'SMALLINT',
	worldRightDirX: 'SMALLINT',
	worldRightDirY: 'SMALLINT',
	worldRightDirZ: 'SMALLINT',
	gForceLateral: 'FLOAT',
	gForceLongitudinal: 'FLOAT',
	gForceVertical: 'FLOAT',
	yaw: 'FLOAT',
	pitch: 'FLOAT',
	roll: 'FLOAT'
}

const telemetry = {
	sessionUID: 'FLOAT',
	sessionTime: 'FLOAT',
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
	brakesTemperatureRearLeft: 'SMALLINT',
	brakesTemperatureRearRight: 'SMALLINT',
	brakesTemperatureFrontLeft: 'SMALLINT',
	brakesTemperatureFrontRight: 'SMALLINT',
	tyresSurfaceTemperatureRearLeft: 'TINYINT',
	tyresSurfaceTemperatureRearRight: 'TINYINT',
	tyresSurfaceTemperatureFrontLeft: 'TINYINT',
	tyresSurfaceTemperatureFrontRight: 'TINYINT',
	tyresInnerTemperatureRearLeft: 'TINYINT',
	tyresInnerTemperatureRearRight: 'TINYINT',
	tyresInnerTemperatureFrontLeft: 'TINYINT',
	tyresInnerTemperatureFrontRight: 'TINYINT',
	engineTemperature: 'SMALLINT',
	tyresPressureRearLeft: 'FLOAT',
	tyresPressureRearRight: 'FLOAT',
	tyresPressureFrontLeft: 'FLOAT',
	tyresPressureFrontRight: 'FLOAT',
	surfaceTypeRearLeft: 'TINYINT',
	surfaceTypeRearRight: 'TINYINT',
	surfaceTypeFrontLeft: 'TINYINT',
	surfaceTypeFrontRight: 'TINYINT'
}

const lap = {
	sessionUID: 'FLOAT',
	sessionTime: 'FLOAT',
	lastLapTimeInMS: 'INT',
	currentLapTimeInMS: 'INT',
	sector1TimeInMS: 'SMALLINT',
	sector2TimeInMS: 'SMALLINT',
	lapDistance: 'FLOAT',
	totalDistance: 'FLOAT',
	safetyCarDelta: 'FLOAT',
	carPosition: 'TINYINT',
	currentLapNum: 'TINYINT',
	pitStatus: 'TINYINT',
	numPitStops: 'TINYINT',
	sector: 'TINYINT',
	currentLapInvalid: 'TINYINT',
	penalties: 'TINYINT',
	warnings: 'TINYINT',
	numUnservedDriveThroughPens: 'TINYINT',
	numUnservedStopGoPens: 'TINYINT',
	gridPosition: 'TINYINT',
	driverStatus: 'TINYINT',
	resultStatus: 'TINYINT',
	pitLaneTimerActive: 'TINYINT',
	pitLaneTimeInLaneInMS: 'SMALLINT',
	pitStopTimerInMS: 'SMALLINT',
	pitStopShouldServePen: 'TINYINT'
}

const session = {
	sessionUID: 'FLOAT',
	sessionTime: 'FLOAT',
	weather: 'TINYINT UNSIGNED',
	trackTemperature: 'TINYINT',
	airTemperature: 'TINYINT',
	totalLaps: 'TINYINT UNSIGNED',
	trackLength: 'SMALLINT',
	sessionType: 'TINYINT UNSIGNED',
	trackId: 'TINYINT',
	formula: 'TINYINT UNSIGNED',
	sessionTimeLeft: 'SMALLINT UNSIGNED',
	sessionDuration: 'SMALLINT UNSIGNED',
	pitSpeedLimit: 'TINYINT UNSIGNED',
	gamePaused: 'TINYINT UNSIGNED',
	isSpectating: 'TINYINT UNSIGNED',
	spectatorCarIndex: 'TINYINT UNSIGNED',
	sliProNativeSupport: 'TINYINT UNSIGNED',
	numMarshalZones: 'TINYINT UNSIGNED',
	safetyCarStatus: 'TINYINT UNSIGNED',
	networkGame: 'TINYINT UNSIGNED',
	forecastAccuracy: 'TINYINT UNSIGNED',
	aiDifficulty: 'TINYINT UNSIGNED',
	seasonLinkIdentifier: 'INT UNSIGNED',
	weekendLinkIdentifier: 'INT UNSIGNED',
	sessionLinkIdentifier: 'INT UNSIGNED',
	pitStopWindowIdealLap: 'TINYINT UNSIGNED',
	pitStopWindowLatestLap: 'TINYINT UNSIGNED',
	pitStopRejoinPosition: 'TINYINT UNSIGNED',
	steeringAssist: 'TINYINT UNSIGNED',
	brakingAssist: 'TINYINT UNSIGNED',
	gearboxAssist: 'TINYINT UNSIGNED',
	pitAssist: 'TINYINT UNSIGNED',
	pitReleaseAssist: 'TINYINT UNSIGNED',
	ERSAssist: 'TINYINT UNSIGNED',
	DRSAssist: 'TINYINT UNSIGNED',
	dynamicRacingLine: 'TINYINT UNSIGNED',
	dynamicRacingLineType: 'TINYINT UNSIGNED',
	gameMode: 'TINYINT UNSIGNED',
	ruleSet: 'TINYINT UNSIGNED',
	timeOfDay: 'INT UNSIGNED',
	sessionLength: 'TINYINT UNSIGNED'
}

const classification = {
	sessionUID: 'FLOAT',
	sessionTime: 'FLOAT',
	position: 'TINYINT UNSIGNED',
	numLaps: 'TINYINT UNSIGNED',
	gridPosition: 'TINYINT UNSIGNED',
	points: 'TINYINT UNSIGNED',
	numPitStops: 'TINYINT UNSIGNED',
	resultStatus: 'TINYINT UNSIGNED',
	bestLapTimeInMS: 'INT UNSIGNED',
	totalRaceTime: 'DOUBLE',
	penaltiesTime: 'TINYINT UNSIGNED',
	numPenalties: 'TINYINT UNSIGNED',
	numTyreStints: 'TINYINT UNSIGNED',
	isPlayer: 'TINYINT'
}

const setupDatabase = async () => {
	await create('player', player)
	await create('motion', motion)
	await create('telemetry', telemetry)
	await create('lap', lap)
	await create('session', session)
	await create('classification', classification)
}

const create = async (table, params) => {
	const columns = Object.entries(params)
		.map(([key, type]) => key + ' ' + type)
		.join(', ')
	const query = `CREATE TABLE ${table} (${columns});`
	await execute(query)
}

const insert = async (table, params) => {
	const keys = Object.keys(params).join(', ')
	const values = Object.values(params).map(mysql.escape).join(', ')
	const query = `INSERT INTO ${table} (${keys}) VALUES (${values})`
	return await execute(query)
}

const execute = query => {
	return new Promise((resolve, reject) => {
		database.state === 'connected' && database.connect()

		database.query(query, (error, results) => {
			error ? reject(error) : resolve(results)
			database.state === 'end' && database.end()
		})
	})
}

module.exports = {
	setupDatabase,
	insert
}
