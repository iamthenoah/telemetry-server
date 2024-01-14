# F122 Telemetry Server

This project facilitates the transfer of telemetry data from the F1 2022 racing game into a database while also providing player registration functionality. It comprises various modules to handle different aspects of the application.

## Prerequisites

Before running the application, ensure you have the following prerequisites installed:

- Node.js
- npm (Node Package Manager)
- MySQL server
- F1 2022 racing game

## Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/f122-telemetry.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd f122-telemetry
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

4. **Create a `.env` file in the project root and set the following environment variables:**

   ```env
   DB_HOST=your_mysql_host
   DB_NAME=your_database_name
   DB_USERNAME=your_mysql_username
   DB_PASSWORD=your_mysql_password
   F122_HOST=your_f122_host
   F122_PORT=your_f122_port
   ```

## Usage

Run the application using the following command:

```bash
npm start
```

This command will set up the database, start the HTTP server, and initialize telemetry data transfer.

## Modules

### 1. Database Module (`database.js`)

- Manages the MySQL database connection.
- Sets up the database by creating tables based on JSON files in the 'tables' directory.
- Provides functions to create tables and insert data into the database.

### 2. Server Module (`server.js`)

- Implements an HTTP server using Express.
- Allows registration of players through a POST request to the '/player' endpoint.
- Serves static files from the 'public' directory.
- Provides a function to set up the server.

### 3. Telemetry Module (`telemetry.js`)

- Utilizes the 'f1-22-udp' module to receive telemetry data from the F1 2022 game.
- Listens to various F122 events such as 'event,' 'motion,' 'carTelemetry,' 'lapData,' 'session,' and 'finalClassification.'
- Inserts relevant telemetry data into the MySQL database.
- Provides a function to set up telemetry.

### 4. Main Entry Point (`index.js`)

- Loads environment variables from a `.env` file.
- Calls setup functions from the database, server, and telemetry modules to initialize the application.

## License

This project is licensed under the [MIT License](LICENSE).

```
Feel free to adjust this Markdown README to match the specifics of your project.
```
