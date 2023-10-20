import mysqlConnection from "../mysql.js";

class ProductController {
  // -------------------------------------------------------------------------------- GET /products
  async getAllProducts(req, res) {
    const query = 'SELECT * FROM products';

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


  // -------------------------------------------------------------------------------- GET /products/:id
  async getProductById(req, res) {
    const query = 'SELECT * FROM products WHERE id = ?';
    const id = req.params.id; // Obtén el ID del parámetro de consulta

    try {
      mysqlConnection.query(query, [id], (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Internal Server Error' });
        } else {
          if (results.length === 0) {
            console.error('Product not found');
            return res.status(404).json({ error: 'Product not found' });
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


  // -------------------------------------------------------------------------------- POST /products
  async postProduct(req, res) {
    const query = 'INSERT INTO products (id, product_name, description, list_price, sale_price, brand, category, available) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const { id, productName, description, listPrice, salePrice, brand, category, available } = req.body;
    const values = [id, productName, description, listPrice, salePrice, brand, category, available];

    try {
      mysqlConnection.query(query, values, (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: 'Internal Server Error' });
        } else {
          const newProduct = {
            id: id,
            product_name: productName, 
            description: description, 
            list_price: listPrice,
            sale_price: salePrice, 
            brand: brand, 
            category: category, 
            available: available
          };
          console.log(newProduct);
          return res.status(201).json(newProduct);
        }
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }


  // -------------------------------------------------------------------------------- PUT /products/:id
  async putProduct(req, res) {
    const id = req.params.id;
    const queryCheck = 'SELECT * FROM products WHERE id = ?';
    const queryUpdate = 'UPDATE products SET product_name = ?, description = ?, list_price = ?, sale_price = ?, brand = ?, category = ?, available = ? WHERE id = ?';

    const { productName, description, listPrice, salePrice, brand, category, available } = req.body;
    const valuesCheck = [id];
   
    mysqlConnection.query(queryCheck, valuesCheck, (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      const valuesUpdate = [productName, description, listPrice, salePrice, brand, category, available, id];
  
      try {
        mysqlConnection.query(queryUpdate, valuesUpdate, (err, results) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
          } else {
            const updatedProduct = {
              id: id,
              product_name: productName, 
              description: description, 
              list_price: listPrice,
              sale_price: salePrice, 
              brand: brand, 
              category: category, 
              available: available
            };
            console.log(updatedProduct);
            return res.status(200).json(updatedProduct);
          }
        });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    });
  }
}

export default ProductController;