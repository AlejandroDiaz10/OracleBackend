import mysqlConnection from "../mysql.js";

class OrderController {
  // -------------------------------------------------------------------------------- GET /orders
  async getAllOrders(req, res) {
    const query = 'SELECT * FROM orders';

    try {
      mysqlConnection.query(query, (err, results) => {
        if (err){
          console.log(err);
          return res.status(500).json({ error: 'Internal Server Error' });
        } else{
          console.log(results);
          return res.status(200).json(results);
        }
      });
    } catch (err) { 
      console.log(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }


  // -------------------------------------------------------------------------------- GET /orders/:id
  async getOrderById(req, res) {
    const query = 'SELECT * FROM orders WHERE id = ?';
    const id = req.params.id; // Obtén el ID del parámetro de consulta

    try {
      mysqlConnection.query(query, [id], (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Internal Server Error' });
        } else {
          if (results.length === 0) {
            console.error('Order not found');
            return res.status(404).json({ error: 'Order not found' });
          }
          console.log(results);
          return res.status(200).json(results);
        }
      });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  }


  // -------------------------------------------------------------------------------- POST /orders
  async postOrder(req, res) {
    const query = 'INSERT INTO orders (order_line_id, id, order_priority, customer_id, customer_segment, product_id, product_container, profit, quantity_ordered, sales, discount, gross_unit_price, shipping_cost, ship_mode, ship_date, order_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const { orderLineId, id, orderPriority, customerId, customerSegment, productId, productContainer, profit, 
      quantityOrdered, sales, discount, grossUnitPrice, shippingCost, shipMode, shipDate, orderDate } = req.body;
    const values = [orderLineId, id, orderPriority, customerId, customerSegment, productId, productContainer, profit, 
      quantityOrdered, sales, discount, grossUnitPrice, shippingCost, shipMode, shipDate, orderDate];

    try {
      mysqlConnection.query(query, values, (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: 'Internal Server Error' });
        } else {
          const newOrder = {
            order_line_id: orderLineId, 
            id: id, 
            order_pririty: orderPriority, 
            customer_id: customerId, 
            customer_segment: customerSegment, 
            product_id: productId, 
            product_container: productContainer, 
            profit: profit, 
            quantity_ordered: quantityOrdered, 
            sales: sales, 
            discount: discount, 
            gross_unit_price: grossUnitPrice, 
            shiping_cost: shippingCost, 
            ship_mode: shipMode, 
            ship_date: shipDate, 
            order_date: orderDate
          };
          console.log(newOrder);
          return res.status(201).json(newOrder);
        }
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }


  // -------------------------------------------------------------------------------- PUT /orders/:id
  async putOrder(req, res) {
    const id = req.params.id;
    const queryCheck = 'SELECT * FROM orders WHERE id = ?';
    const queryUpdate = 'UPDATE orders SET order_line_id = ?, order_priority = ?, customer_id = ?, customer_segment = ?, product_id = ?, product_container = ?, profit = ?, quantity_ordered = ?, sales = ?, discount = ?, gross_unit_price = ?, shipping_cost = ?, ship_mode = ?, ship_date = ?, order_date = ? WHERE id = ?';
    const { orderLineId, orderPriority, customerId, customerSegment, productId, productContainer, profit, 
      quantityOrdered, sales, discount, grossUnitPrice, shippingCost, shipMode, shipDate, orderDate } = req.body;
    const valuesCheck = [id];
  
    mysqlConnection.query(queryCheck, valuesCheck, (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }
  
      const valuesUpdate = [orderLineId, orderPriority, customerId, customerSegment, productId, productContainer, profit, 
        quantityOrdered, sales, discount, grossUnitPrice, shippingCost, shipMode, shipDate, orderDate, id];
  
      try {
        mysqlConnection.query(queryUpdate, valuesUpdate, (err, results) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
          } else {
            const updatedOrder = {
              order_line_id: orderLineId, 
              id: id, 
              order_pririty: orderPriority, 
              customer_id: customerId, 
              customer_segment: customerSegment, 
              product_id: productId, 
              product_container: productContainer, 
              profit: profit, 
              quantity_ordered: quantityOrdered, 
              sales: sales, 
              discount: discount, 
              gross_unit_price: grossUnitPrice, 
              shiping_cost: shippingCost, 
              ship_mode: shipMode, 
              ship_date: shipDate, 
              order_date: orderDate
            };
            console.log(updatedOrder);
            return res.status(200).json(updatedOrder);
          }
        });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    });
  }
}

export default OrderController;