import oracleConnection from "../oracle.js";
import elasticClient from "../elastic-client.js";

class CustomerController {
  // -------------------------------------------------------------------------------- GET /customers
  async getAllCustomers(req, res) {
    const query = 'SELECT * FROM customers';

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


  // -------------------------------------------------------------------------------- GET /customers/:id
  async getCustomerById(req, res) {
    const query = 'SELECT * FROM customers WHERE id = :id';
    const id = req.params.id;
  
    try {
      const result = await oracleConnection.execute(query, [id]);
      if (result.rows.length === 0) {
        console.error('Customer not found');
        return res.status(404).json({ error: 'Customer not found' });
      } else {
        console.log(result.rows);
        return res.status(200).json(result.rows);
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }


  // -------------------------------------------------------------------------------- POST /customers
  async postCustomer(req, res) {
    const query = 'INSERT INTO customers (id, name, age, ssn, occupation, annual_income, monthly_inhand_salary, num_bank_accounts, num_credit_card) VALUES (:id, :name, :age, :ssn, :occupation, :annualIncome, :monthlyInhandSalary, :numBankAccounts, :numCreditCard)';
    const { id, name, age, ssn, occupation, annualIncome, monthlyInhandSalary, numBankAccounts, numCreditCard } = req.body;
    const values = { 
      id: id,
      name: name,
      age: age,
      ssn: ssn,
      occupation: occupation,
      annualIncome: annualIncome,
      monthlyInhandSalary: monthlyInhandSalary,
      numBankAccounts: numBankAccounts,
      numCreditCard: numCreditCard
    };

    try {
      const result = await oracleConnection.execute(query, values, { autoCommit: true });
      const newCustomer = {
        id: id,
        name: name,
        age: age,
        ssn: ssn,
        occupation: occupation,
        annual_income: annualIncome,
        monthly_inhand_salary: monthlyInhandSalary,
        num_bank_accounts: numBankAccounts,
        num_credit_card: numCreditCard
      };
      console.log(newCustomer);
      return res.status(201).json(newCustomer);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }


  // -------------------------------------------------------------------------------- PUT /customers/:id
  async putCustomer(req, res) {
    const id = req.params.id;
    const queryCheck = 'SELECT * FROM customers WHERE id = :id'; 
    const queryUpdate = 'UPDATE customers SET name = :name, age = :age, ssn = :ssn, occupation = :occupation, annual_income = :annualIncome, monthly_inhand_salary = :monthlyInhandSalary, num_bank_accounts = :numBankAccounts, num_credit_card = :numCreditCard WHERE id = :id'; // Usa un marcador de posición con nombre
    const { name, age, ssn, occupation, annualIncome, monthlyInhandSalary, numBankAccounts, numCreditCard } = req.body;
    const valuesCheck = { id: id }; 
  
    try {
      const resultCheck = await oracleConnection.execute(queryCheck, valuesCheck);
      if (resultCheck.rows.length === 0) {
        return res.status(404).json({ error: 'Customer not found' });
      }
  
      const valuesUpdate = {
        id: id,
        name: name,
        age: age,
        ssn: ssn,
        occupation: occupation,
        annualIncome: annualIncome,
        monthlyInhandSalary: monthlyInhandSalary,
        numBankAccounts: numBankAccounts,
        numCreditCard: numCreditCard
      };
  
      const resultUpdate = await oracleConnection.execute(queryUpdate, valuesUpdate, { autoCommit: true });
      const updatedCustomer = {
        id: id,
        name: name,
        age: age,
        ssn: ssn,
        occupation: occupation,
        annual_income: annualIncome,
        monthly_inhand_salary: monthlyInhandSalary,
        num_bank_accounts: numBankAccounts,
        num_credit_card: numCreditCard
      };
      console.log(updatedCustomer);
      return res.status(200).json(updatedCustomer);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // -------------------------------------------------------------------------------- ElasticSearch
  // -------------------------------------------------------------------------------- ElasticSearch
  async getAll(req, res) {
    const query = {
      index: 'customers',
      body: {
        query: {
          match_all: {}
        }
      }
    };

    try {
      const body = await elasticClient.search(query);
      console.log("res", body);
      if (body.hits.total.value === 0) {
        return res.status(404).json({ error: 'No customers found' });
      }
      const customers = body.hits.hits.map((hit) => hit._source);
      return res.status(200).json(customers);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async getId(req, res) {
    let query = {
      index: 'customers',
      id: req.params.id
    };
  
    try {
      const body = await elasticClient.get(query);
      if (!body.found) {
        return res.status(404).json({ error: 'Customer not found' });
      }
      return res.status(200).json(body._source);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default CustomerController;