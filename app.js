import express from 'express';
import elasticClient from './src/elastic-client.js';
import oracleConnection from './src/oracle.js';
import customerRouter from './src/routes/customer.js';
import productRouter from './src/routes/product.js';
import orderRouter from './src/routes/order.js';
import creditStatusRouter from './src/routes/creditStatus.js';
import fetchAndIndexData from './src/index-es.js';

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


// ------------------------------ Checking Elasticseacrh connection
if (elasticClient) {
  // fetchAndIndexData("customers");
  // fetchAndIndexData("products");
  // fetchAndIndexData("orders");
  // fetchAndIndexData("credit_status");
} else {
  console.error('Error connecting to Elasticsearch!');
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