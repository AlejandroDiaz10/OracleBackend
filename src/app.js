import express from 'express';
import oracleConnection from './oracle.js';
import customerRouter from './routes/customer.js';
import productRouter from './routes/product.js';
import orderRouter from './routes/order.js';
import creditStatusRouter from './routes/creditStatus.js';
const app = express();

// ------------------------------ Express configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ------------------------------ Checking DB connection
if (oracleConnection) {
  console.log('Connected to Oracle database!');
} else {
  console.error('Error connecting to Oracle database!');
}

// ------------------------------ Routes
app.use(customerRouter);
app.use(productRouter);
app.use(orderRouter);
app.use(creditStatusRouter);


// ------------------------------ Listening port
const port = process.env.PORT || 8080; 
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

