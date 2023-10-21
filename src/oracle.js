import oracledb from 'oracledb';
import dotenv from 'dotenv';
dotenv.config();
// oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

async function runApp() {
    let connection;
    console.log('Testing Connection!');
    // console.log('Holi', process.env.ORACLE_DB_USER);
    // console.log('Holi', process.env.ORACLE_DB_PWD);
    // console.log('Holi', process.env.ORACLE_CONNECTION_STRING);

    try {
        console.log('Testing Connection!');
        connection = await oracledb.getConnection({
            user: process.env.ORACLE_DB_USER,
            password: process.env.ORACLE_DB_PWD,
            connectionString: process.env.ORACLE_CONNECTION_STRING2,
        });
    } catch (err) {
        console.error(err);
        return;
    }

    console.log('Connection was successful!');

    // Ahora consulta las filas
    const result = await connection.execute(`SELECT * FROM PRODUCTS`);
    console.log(result.rows);
}

runApp();