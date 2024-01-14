// Import necessary modules
const mysql = require('mysql')
const path = require('path')
const fs = require('fs')

// Create a MySQL database connection
const database = mysql.createConnection({
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	user: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD
})

// Function to set up the database by creating tables
const setupDatabase = async () => {
	// Define the path to the 'tables' directory
	const tables = path.resolve(process.cwd(), 'tables')

	// Loop through files in the 'tables' directory
	for (const file of fs.readdirSync(tables)) {
		const ext = path.extname(file)

		// Check if the file has a '.json' extension
		if (ext == '.json') {
			// Create a table based on the file's JSON content
			await createTable(file.replace(ext, ''), require(path.resolve(tables, file)))
		}
	}
}

// Function to create a table in the database
const createTable = async (table, params) => {
	// Extract columns and their types from the parameters
	const columns = Object.entries(params)
		.map(([key, type]) => key + ' ' + type)
		.join(', ')

	// Execute the query to create a table if it doesn't exist
	await execute(`CREATE TABLE IF NOT EXISTS ${table} (${columns})`)
}

// Function to insert data into a specified table
const insert = async (table, params) => {
	// Extract keys and values from the parameters
	const keys = Object.keys(params).join(', ')
	const values = Object.values(params).map(mysql.escape).join(', ')

	// Execute the query to insert data into the table
	return await execute(`INSERT INTO ${table} (${keys}) VALUES (${values})`)
}

// Function to execute a SQL query
const execute = query => {
	// Return a promise for executing the query
	return new Promise((resolve, reject) => {
		// Use the database connection to execute the query
		database.query(query, (error, results) => {
			// Resolve with results or reject with an error
			error ? reject(error) : resolve(results)
		})
	})
}

// Export the setupDatabase function and the insert function
module.exports = {
	setupDatabase,
	insert
}
