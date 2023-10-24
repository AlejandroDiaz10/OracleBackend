import oracledb from 'oracledb';
import dotenv from 'dotenv';
dotenv.config();

// ------------------------------- Oracle connection
let oracleConnection = null;

try {
    oracleConnection = await oracledb.getConnection({
        user: process.env.ORACLE_DB_USER,
        password: process.env.ORACLE_DB_PWD,
        connectionString: process.env.ORACLE_CONNECTION_STRING,
    });
    console.log('Oracle connection was successful!');
} catch (error) {
    console.error('Error connecting to Oracle database:', error);
}

export default oracleConnection;