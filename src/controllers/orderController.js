import oracleConnection from "../oracle.js";

class OrderController {
  // -------------------------------------------------------------------------------- GET /orders
  async getAllOrders(req, res) {
    const query = 'SELECT * FROM orders';

    try {
      oracleConnection.execute(query, (err, results) => {
        if (err){
          console.log(err);
          return res.status(500).json({ error: 'Internal Server Error' });
        } else{
          console.log(results.rows);
          return res.status(200).json(results.rows);
        }
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }


  // -------------------------------------------------------------------------------- GET /orders/:orderLineId
  async getOrderById(req, res) {
    const query = 'SELECT * FROM orders WHERE order_line_id = :orderLineId';
    const orderLineId = req.params.orderLineId; 

    try {
      const result = await oracleConnection.execute(query, [orderLineId]);
      if (result.rows.length === 0) {
        console.error('Order not found');
        return res.status(404).json({ error: 'Order not found' });
      } else {
        console.log(result.rows);
        return res.status(200).json(result.rows);
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // -------------------------------------------------------------------------------- GET /orders/customer/:customerId
  async getOrdersByCustomerId(req, res) {
    const query = 'SELECT * FROM orders WHERE customer_id = :customerId';
    const customerId = req.params.customerId; 
    const currentDate = new Date();
    const filter = req.query.filter;

    const formatDate = (dateString) => {
      const parts = dateString.split('/'); 
      const day = parts[0].padStart(2, '0');
      const month = parts[1].padStart(2, '0');
      const year = `20${parts[2]}`; 
      const formattedDate = `${year}-${month}-${day}`;
      return formattedDate;
    };

    try {
      const result = await oracleConnection.execute(query, [customerId]);
      if (result.rows.length === 0) {
        console.error('No orders found for this customer');
        return res.status(404).json({ error: 'No orders found for this customer' });
      } else {
        if (filter === undefined) {
          console.log(result.rows);
          return res.status(200).json(result.rows);
        } else if (filter === 'pending') {
          const pendingOrders = result.rows.filter(order => {
            const formattedDate = new Date(formatDate(order[14]));
            return formattedDate > currentDate
          });
          
          if (pendingOrders.length === 0) {
            console.error('No pending orders found for this customer');
            return res.status(200).json({ message: 'No pending orders found for this customer' })
          }

          pendingOrders.sort((a, b) => {
            const dateA = new Date(formatDate(a[14]));
            const dateB = new Date(formatDate(b[14]));
            if (dateA < dateB) {
              return -1;
            }
            if (dateA > dateB) {
                return 1;
            }
            return 0;
          });

          console.log(pendingOrders);
          return res.status(200).json(pendingOrders);
        } else if (filter === 'completed') {
          const completedOrders = result.rows.filter(order => {
            const formattedDate = new Date(formatDate(order[14]));
            return formattedDate <= currentDate
          });

          if (completedOrders.length === 0) {
            console.error('No completed orders found for this customer');
            return res.status(200).json({ message: 'No completed orders found for this customer' })
          }

          completedOrders.sort((a, b) => {
            const dateA = new Date(formatDate(a[14]));
            const dateB = new Date(formatDate(b[14]));
            if (dateA < dateB) {
              return -1;
            }
            if (dateA > dateB) {
                return 1;
            }
            return 0;
          });

          console.log(completedOrders);
          return res.status(200).json(completedOrders);
        } else {
          console.log("Invalid filter");
          return res.status(500).json({ error: 'Invalid filter' });
        }
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }


  // -------------------------------------------------------------------------------- POST /orders
  async postOrder(req, res) {
    const query = 'INSERT INTO orders (order_line_id, id, order_priority, customer_id, customer_segment, product_id, product_container, profit, quantity_ordered, sales, discount, gross_unit_price, shipping_cost, ship_mode, ship_date, order_date) VALUES (:orderLineId, :id, :orderPriority, :customerId, :customerSegment, :productId, :productContainer, :profit, :quantityOrdered, :sales, :discount, :grossUnitPrice, :shippingCost, :shipMode, :shipDate, :orderDate)';
    const { orderLineId, id, orderPriority, customerId, customerSegment, productId, productContainer, profit, 
      quantityOrdered, sales, discount, grossUnitPrice, shippingCost, shipMode, shipDate, orderDate } = req.body;
    const values = { 
      orderLineId: orderLineId, 
      id: id, 
      orderPriority: orderPriority, 
      customerId: customerId, 
      customerSegment: customerSegment, 
      productId: productId, 
      productContainer: productContainer, 
      profit: profit, 
      quantityOrdered: quantityOrdered, 
      sales: sales, 
      discount: discount, 
      grossUnitPrice: grossUnitPrice, 
      shippingCost: shippingCost, 
      shipMode: shipMode, 
      shipDate: shipDate, 
      orderDate: orderDate
    };
  
    try {
      const result = await oracleConnection.execute(query, values, { autoCommit: true });
      const newOrder = {
        order_line_id: orderLineId, 
        id: id, 
        order_priority: orderPriority, 
        customer_id: customerId, 
        customer_segment: customerSegment, 
        product_id: productId, 
        product_container: productContainer, 
        profit: profit, 
        quantity_ordered: quantityOrdered, 
        sales: sales, 
        discount: discount, 
        gross_unit_price: grossUnitPrice, 
        shipping_cost: shippingCost, 
        ship_mode: shipMode, 
        ship_date: shipDate, 
        order_date: orderDate
      };
      console.log(newOrder);
      return res.status(201).json(newOrder);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  

  // -------------------------------------------------------------------------------- PUT /orders/:orderLineId
  async putOrder(req, res) {
    const orderLineId = req.params.orderLineId;
    const queryCheck = 'SELECT * FROM orders WHERE order_line_id = :orderLineId'; 
    const queryUpdate = 'UPDATE orders SET id = :id, order_priority = :orderPriority, customer_id = :customerId, customer_segment = :customerSegment, product_id = :productId, product_container = :productContainer, profit = :profit, quantity_ordered = :quantityOrdered, sales = :sales, discount = :discount, gross_unit_price = :grossUnitPrice, shipping_cost = :shippingCost, ship_mode = :shipMode, ship_date = :shipDate, order_date = :orderDate WHERE order_line_id = :orderLineId';
    const { id, orderPriority, customerId, customerSegment, productId, productContainer, profit, 
      quantityOrdered, sales, discount, grossUnitPrice, shippingCost, shipMode, shipDate, orderDate } = req.body;
    const valuesCheck = { orderLineId: orderLineId }; 
    
    try {
      const resultCheck = await oracleConnection.execute(queryCheck, valuesCheck);
      if (resultCheck.rows.length === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }
    
      const valuesUpdate = { 
        orderLineId: orderLineId, 
        id: id,
        orderPriority: orderPriority, 
        customerId: customerId, 
        customerSegment: customerSegment, 
        productId: productId, 
        productContainer: productContainer, 
        profit: profit, 
        quantityOrdered: quantityOrdered, 
        sales: sales, 
        discount: discount, 
        grossUnitPrice: grossUnitPrice, 
        shippingCost: shippingCost, 
        shipMode: shipMode, 
        shipDate: shipDate, 
        orderDate: orderDate
      };
    
      const resultUpdate = await oracleConnection.execute(queryUpdate, valuesUpdate, { autoCommit: true });
      const updatedOrder = {
        order_line_id: orderLineId, 
        id: id,
        order_priority: orderPriority, 
        customer_id: customerId, 
        customer_segment: customerSegment, 
        product_id: productId, 
        product_container: productContainer, 
        profit: profit, 
        quantity_ordered: quantityOrdered, 
        sales: sales, 
        discount: discount, 
        gross_unit_price: grossUnitPrice, 
        shipping_cost: shippingCost, 
        ship_mode: shipMode, 
        ship_date: shipDate, 
        order_date: orderDate
      };
      console.log(updatedOrder);
      return res.status(200).json(updatedOrder);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }    
}

export default OrderController;