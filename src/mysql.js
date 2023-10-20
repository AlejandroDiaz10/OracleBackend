import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config(); 

// ------------------------------- MYSQL connection
const mysqlConnection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PWD,
    database: process.env.MYSQL_DB,
});

mysqlConnection.connect((err) => {
    if (err) throw err;
});

export default mysqlConnection;