import mysqlConnection from "../mysql.js";

class CustomerController {
  // -------------------------------------------------------------------------------- GET /customers
  async getAllCustomers(req, res) {
    const query = 'SELECT * FROM customers';

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


  // -------------------------------------------------------------------------------- GET /customers/:id
  async getCustomerById(req, res) {
    const query = 'SELECT * FROM customers WHERE id = ?';
    const id = req.params.id; // Obtén el ID del parámetro de consulta

    try {
      mysqlConnection.query(query, [id], (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Internal Server Error' });
        } else {
          if (results.length === 0) {
            console.error('Customer not found');
            return res.status(404).json({ error: 'Customer not found' });
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


  // -------------------------------------------------------------------------------- POST /customers
  async postCustomer(req, res) {
    const query = 'INSERT INTO customers (id, name, age, ssn, occupation, annual_income, monthly_inhand_salary, num_bank_accounts, num_credit_card) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const { id, name, age, ssn, occupation, annualIncome, monthlyInhandSalary, numBankAccounts, numCreditCard } = req.body;
    const values = [id, name, age, ssn, occupation, annualIncome, monthlyInhandSalary, numBankAccounts, numCreditCard];

    try {
      mysqlConnection.query(query, values, (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: 'Internal Server Error' });
        } else {
          const newCustomer = {
            id: id,
            name: name, 
            age: age, 
            ssn: ssn, 
            occupation: occupation, 
            annual_income: annualIncome, 
            monthly_inhand_salary :monthlyInhandSalary, 
            num_bank_accounts: numBankAccounts, 
            num_credit_card: numCreditCard
          };
          console.log(newCustomer);
          return res.status(201).json(newCustomer);
        }
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }


  // -------------------------------------------------------------------------------- PUT /customers/:id
  async putCustomer(req, res) {
    const id = req.params.id;
    const queryCheck = 'SELECT * FROM customers WHERE id = ?';
    const queryUpdate = 'UPDATE customers SET name = ?, age = ?, ssn = ?, occupation = ?, annual_income = ?, monthly_inhand_salary = ?, num_bank_accounts = ?, num_credit_card = ? WHERE id = ?';
    const { name, age, ssn, occupation, annualIncome, monthlyInhandSalary, numBankAccounts, numCreditCard } = req.body;
    const valuesCheck = [id];
   
    mysqlConnection.query(queryCheck, valuesCheck, (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Customer not found' });
      }
  
      const valuesUpdate = [name, age, ssn, occupation, annualIncome, monthlyInhandSalary, numBankAccounts, numCreditCard, id];
  
      try {
        mysqlConnection.query(queryUpdate, valuesUpdate, (err, results) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
          } else {
            const updatedCustomer = {
                id: id,
                name: name, 
                age: age, 
                ssn: ssn, 
                occupation: occupation, 
                annual_income: annualIncome, 
                monthly_inhand_salary :monthlyInhandSalary, 
                num_bank_accounts: numBankAccounts, 
                num_credit_card: numCreditCard
            };
            console.log(updatedCustomer);
            return res.status(200).json(updatedCustomer);
          }
        });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    });
  }
}

export default CustomerController;