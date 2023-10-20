import oracleConnection from "../oracle.js";

class ProductController {
  // -------------------------------------------------------------------------------- GET /products
  async getAllProducts(req, res) {
    const query = 'SELECT * FROM products';

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


  // -------------------------------------------------------------------------------- GET /products/:id
  async getProductById(req, res) {
    const query = 'SELECT * FROM products WHERE id = :id';
    const id = req.params.id;

    try {
      const result = await oracleConnection.execute(query, [id]);
      if (result.rows.length === 0) {
        console.error('Product not found');
        return res.status(404).json({ error: 'Product not found' });
      } else {
        console.log(result.rows);
        return res.status(200).json(result.rows);
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }


  // -------------------------------------------------------------------------------- POST /products
  async postProduct(req, res) {
    const query = 'INSERT INTO products (id, product_name, description, list_price, sale_price, brand, category, available) VALUES (:id, :productName, :description, :listPrice, :salePrice, :brand, :category, :available)';
    const { id, productName, description, listPrice, salePrice, brand, category, available } = req.body;
    const values = {
      id: id,
      productName: productName,
      description: description,
      listPrice: listPrice,
      salePrice: salePrice,
      brand: brand,
      category: category,
      available: available
    };
  
    try {
      const result = await oracleConnection.execute(query, values, { autoCommit: true });
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
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }


  // -------------------------------------------------------------------------------- PUT /products/:id
  async putProduct(req, res) {
    const id = req.params.id;
    const queryCheck = 'SELECT * FROM products WHERE id = :id'; 
    const queryUpdate = 'UPDATE products SET product_name = :productName, description = :description, list_price = :listPrice, sale_price = :salePrice, brand = :brand, category = :category, available = :available WHERE id = :id'; // Usa un marcador de posición con nombre
    const { productName, description, listPrice, salePrice, brand, category, available } = req.body;
    const valuesCheck = { id: id }; 
  
    try {
      const resultCheck = await oracleConnection.execute(queryCheck, valuesCheck);
      if (resultCheck.rows.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      const valuesUpdate = {
        id: id,
        productName: productName,
        description: description,
        listPrice: listPrice,
        salePrice: salePrice,
        brand: brand,
        category: category,
        available: available
      };
  
      const resultUpdate = await oracleConnection.execute(queryUpdate, valuesUpdate, { autoCommit: true });
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
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }  
}

export default ProductController;