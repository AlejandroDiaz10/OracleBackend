import express from 'express';
import mysqlConnection from './mysql.js';
import creditLineRouter from './routes/creditLine.js';
const app = express();

// ------------------------------ Express configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ------------------------------ Checking DB connection
mysqlConnection.connect((err) => {
    if (err) {
      console.error('Error connecting to database!', err);
      return;
    }
    console.log('Connected to MySQL database!');
});

// ------------------------------ Routes
app.use(creditLineRouter);


// ------------------------------ Listening port
const port = process.env.PORT || 8080; 
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

