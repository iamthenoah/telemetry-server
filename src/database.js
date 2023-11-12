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
	suspensionPositionRL: 'FLOAT',
	suspensionPositionRR: 'FLOAT',
	suspensionPositionFL: 'FLOAT',
	suspensionPositionFR: 'FLOAT',
	suspensionVelocityRL: 'FLOAT',
	suspensionVelocityRR: 'FLOAT',
	suspensionVelocityFL: 'FLOAT',
	suspensionVelocityFR: 'FLOAT',
	suspensionAccelerationRL: 'FLOAT',
	suspensionAccelerationRR: 'FLOAT',
	suspensionAccelerationFL: 'FLOAT',
	suspensionAccelerationFR: 'FLOAT',
	wheelSpeedRL: 'FLOAT',
	wheelSpeedRR: 'FLOAT',
	wheelSpeedFL: 'FLOAT',
	wheelSpeedFR: 'FLOAT',
	wheelSlipRL: 'FLOAT',
	wheelSlipRR: 'FLOAT',
	wheelSlipFL: 'FLOAT',
	wheelSlipFR: 'FLOAT',
	localVelocityX: 'FLOAT',
	localVelocityY: 'FLOAT',
	localVelocityZ: 'FLOAT',
	angularVelocityX: 'FLOAT',
	angularVelocityY: 'FLOAT',
	angularVelocityZ: 'FLOAT',
	angularAccelerationX: 'FLOAT',
	angularAccelerationY: 'FLOAT',
	angularAccelerationZ: 'FLOAT',
	frontWheelsAngle: 'FLOAT'
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
	numTyreStints: 'TINYINT UNSIGNED'
}

const setupDatabase = async () => {
	create('player', player)
	create('motion', motion)
	create('session', session)
	create('classification', classification)
}

const create = async (table, params) => {
	const columns = Object.entries(params)
		.map(([key, type]) => key + ' ' + type)
		.join(', ')
	const query = `CREATE TABLE ${table} (${columns});`
	return await execute(query)
}

const select = async (table, params) => {
	const where = Object.entries(params)
		.map(([key, value]) => `${key} = ${mysql.escape(value)}`)
		.join(' AND ')
	const query = `SELECT * FROM ${table} WHERE ${where}`
	return await execute(query)
}

const insert = async (table, params) => {
	const keys = Object.keys(params).join(', ')
	const values = Object.values(params).map(mysql.escape).join(', ')
	const query = `INSERT INTO ${table} (${keys}) VALUES (${values})`
	return await execute(query)
}

const execute = query => {
	return new Promise((resolve, reject) => {
		database.connect()

		database.query(query, (error, results) => {
			error ? reject(error) : resolve(results)
			database.end()
		})
	})
}

module.exports = {
	setupDatabase,
	select,
	insert
}
