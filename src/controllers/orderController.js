import oracleConnection from "../oracle.js";

class OrderController {
  // -------------------------------------------------------------------------------- GET /orders
  async getAllOrders(req, res) {
    const query = 'SELECT * FROM orders';

    try {
      oracleConnection.execute(query, (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: 'Internal Server Error' });
        } else {
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

    const getProductName = async (productId) => {
      const productQuery = 'SELECT * FROM products WHERE id = :productId';
      try {
        const productResult = await oracleConnection.execute(productQuery, [productId]);
        if (productResult.rows.length > 0) {
          return productResult.rows[0][1]; 
        } else {
          return 'Product name not found';
        }
      } catch (error) {
        console.error('Error fetching product name:', error);
        return 'Error fetching product name'; 
      }
    };

    try {
      const result = await oracleConnection.execute(query, [customerId]);
      if (result.rows.length === 0) {
        console.error('No orders found for this customer');
        return res.status(404).json({ error: 'No orders found for this customer' });
      } else {
        const data_dic = result.rows.map(order => {
          return {
            'order_line_id': order[0],
            'id': order[1],
            'order_priority': order[2],
            'customer_id': order[3],
            'customer_segment': order[4],
            'product_id': order[5],
            'product_container': order[6],
            'profit': order[7],
            'quantity_ordered': order[8],
            'sales': order[9],
            'discount': order[10],
            'gross_unit_price': order[11],
            'shipping_cost': order[12],
            'ship_mode': order[13],
            'ship_date': order[14],
            'order_date': order[15]
          }
        });

        for (const order of data_dic) {
          const productName = await getProductName(order.product_id);
          order.product_name = productName;
        }

        if (filter === "All") {
          console.log(res);
          return res.status(200).json(data_dic);

        } else if (filter === 'Pending') {
          const pendingOrders = data_dic.filter(order => {
            const formattedDate = new Date(formatDate(order.ship_date));
            return formattedDate > currentDate
          });

          if (pendingOrders.length === 0) {
            console.error('No pending orders found for this customer');
            return res.status(200).json({ message: 'No pending orders found for this customer' })
          }

          pendingOrders.sort((a, b) => {
            const dateA = new Date(formatDate(a.order_date));
            const dateB = new Date(formatDate(b.order_date));
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

        } else if (filter === 'Completed') {
          const completedOrders = data_dic.filter(order => {
            const formattedDate = new Date(formatDate(order.ship_date));
            return formattedDate <= currentDate
          });

          if (completedOrders.length === 0) {
            console.error('No completed orders found for this customer');
            return res.status(200).json({ message: 'No completed orders found for this customer' })
          }

          completedOrders.sort((a, b) => {
            const dateA = new Date(formatDate(a.order_date));
            const dateB = new Date(formatDate(b.order_date));
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


  async test(req, res) {
    const column = req.params.column;
    console.log(column);
    const query = `SELECT DISTINCT ${column} FROM orders`;

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

  // -------------------------------------------------------------------------------- POST /orders
  async postOrder(req, res) {
    const { orderPriority, customerId, productId, quantityOrdered } = req.body;
    console.log(req.body);
    console.log(orderPriority, customerId, productId, quantityOrdered);

    const ship_modes = ["Air Regular", "Truck Delivery", "Air Express", "Express"]
    const product_containers = ['Jumbo Barrel' , 'Paper Bag', 'Small Box', 'Large Box','Jumbo Box', 'Small Package','Medium Box']
    const customer_segments = ["Cliente", "Home Office", "Corporativo", "Negocio Pequeño"]
    const order_priorities = ["Low", "Not Specified", "High", "Medium", "Critical"]

    const currentDate = new Date();
    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Los meses en JavaScript son base cero
    const year = currentDate.getFullYear().toString().slice(-2); // Obtén los últimos dos dígitos del año
    const orderDate = `${day}/${month}/${year}`;

    const customerSegment = customer_segments[Math.floor(Math.random() * customer_segments.length)];

    let shipMode = ship_modes[Math.floor(Math.random() * ship_modes.length)];
    let productContainer = product_containers[Math.floor(Math.random() * product_containers.length)];

    try {
      const maxOrderLineIdQuery = 'SELECT MAX(order_line_id) AS max_order_line_id FROM orders';
      const maxIdQuery = 'SELECT MAX(id) AS max_id FROM orders';
      const productCostQuery = 'SELECT sale_price FROM products WHERE id = :productId';
      const query = 'INSERT INTO orders (order_line_id, id, order_priority, customer_id, customer_segment, product_id, product_container, profit, quantity_ordered, sales, discount, gross_unit_price, shipping_cost, ship_mode, ship_date, order_date) VALUES (:orderLineId, :id, :orderPriority, :customerId, :customerSegment, :productId, :productContainer, :profit, :quantityOrdered, :sales, :discount, :grossUnitPrice, :shippingCost, :shipMode, :shipDate, :orderDate)';

      const maxOrderLineIdResult = await oracleConnection.execute(maxOrderLineIdQuery, [], { autoCommit: true });
      const newOrderLineId = maxOrderLineIdResult.rows[0][0] + 1;

      const maxIdResult = await oracleConnection.execute(maxIdQuery, [], { autoCommit: true });
      const newId = maxIdResult.rows[0][0] + 1;

      const productCostResult = await oracleConnection.execute(productCostQuery, [productId.toString()]);
      const grossUnitPrice = productCostResult.rows[0][0];

      const sales = grossUnitPrice * quantityOrdered;
      let shippingCost = sales * 0.1;
      let futureDate = new Date(currentDate);
      futureDate.setDate(currentDate.getDate() + 7);

      if (orderPriority === "High" || orderPriority === "Critical"){
        shipMode = "Express";
        futureDate.setDate(currentDate.getDate() + 3);
        shippingCost = sales * 0.2;
      } else if (orderPriority === "Medium"){
        shipMode = "Air Express";
        futureDate.setDate(currentDate.getDate() + 5);
        shippingCost = sales * 0.15;
      }

      const dayF = futureDate.getDate().toString().padStart(2, '0');
      const monthF = (futureDate.getMonth() + 1).toString().padStart(2, '0'); // Los meses en JavaScript son base cero
      const yearF = futureDate.getFullYear().toString().slice(-2); // Obtén los últimos dos dígitos del año
      const shipDate = `${dayF}/${monthF}/${yearF}`;

      const profit = sales * .3 + shippingCost * .3;
      const discount = 0;
      
      const values = {  
          orderLineId: newOrderLineId, 
          id: newId, 
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

      console.log(values);

      const result = await oracleConnection.execute(query, values, { autoCommit: true });

      const newOrder = {
          order_line_id: newOrderLineId, 
          id: newId, 
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