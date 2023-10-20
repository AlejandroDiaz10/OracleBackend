import mysqlConnection from "../mysql.js";

class CreditLineController {
  // -------------------------------------------------------------------------------- GET /credit-line
  async getAllCreditLines(req, res) {
    const query = 'SELECT * FROM credit_line';

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


  // -------------------------------------------------------------------------------- GET /credit-line/:id
  async getCreditLineById(req, res) {
    const query = 'SELECT * FROM credit_line WHERE id = ?';
    const id = req.params.id; // Obtén el ID del parámetro de consulta

    try {
      mysqlConnection.query(query, [id], (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Internal Server Error' });
        } else {
          if (results.length === 0) {
            console.error('Credit Line not found');
            return res.status(404).json({ error: 'Credit Line not found' });
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


  // -------------------------------------------------------------------------------- POST /credit-line
  async postCreditLine(req, res) {
    const query = 'INSERT INTO credit_line (credit_limit, current_balance, update_date) VALUES (?, ?, ?)';
    const { creditLimit, currentBalance, updateDate } = req.body;
    const values = [creditLimit, currentBalance, updateDate];

    try {
      mysqlConnection.query(query, values, (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: 'Internal Server Error' });
        } else {
          const newCreditLine = {
            id: results.insertId,
            credit_limit: creditLimit,
            current_balance: currentBalance,
            update_date: new Date(updateDate).toISOString()
          };
          console.log(newCreditLine);
          return res.status(201).json(newCreditLine);
        }
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }


  // -------------------------------------------------------------------------------- PUT /credit-line/:id
  async putCreditLine(req, res) { 
    const id = req.params.id;
    const queryCheck = 'SELECT * FROM credit_line WHERE id = ?';
    const queryUpdate = 'UPDATE credit_line SET credit_limit = ?, current_balance = ?, update_date = ? WHERE id = ?';
    const { creditLimit, currentBalance, updateDate } = req.body;
    const valuesCheck = [id];
  
    mysqlConnection.query(queryCheck, valuesCheck, (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Credit Line not found' });
      }
  
      const valuesUpdate = [creditLimit, currentBalance, updateDate, id];
  
      try {
        mysqlConnection.query(queryUpdate, valuesUpdate, (err, results) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
          } else {
            const updatedCreditLine = {
              id: id,
              credit_limit: creditLimit,
              current_balance: currentBalance,
              update_date: new Date(updateDate).toISOString()
            };
            console.log(updatedCreditLine);
            return res.status(200).json(updatedCreditLine);
          }
        });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    });
  }
}

export default CreditLineController;