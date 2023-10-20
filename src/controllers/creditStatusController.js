import mysqlConnection from "../mysql.js";

class CreditStatusController {
  // ------------------------------------------------------------------------ GET /credit-status
  async getAllCreditStatus(req, res) {
    const query = 'SELECT * FROM credit_status';

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


  // -------------------------------------------------------------------------------- GET /credit-status/:id
  async getCreditStatusById(req, res) {
    const query = 'SELECT * FROM credit_status WHERE id = ?';
    const id = req.params.id; // Obtén el ID del parámetro de consulta

    try {
      mysqlConnection.query(query, [id], (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Internal Server Error' });
        } else {
          if (results.length === 0) {
            console.error('Credit Status not found');
            return res.status(404).json({ error: 'Credit Status not found' });
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


  // -------------------------------------------------------------------------------- POST /credit-status
  async postCreditStatus(req, res) {
    const query = 'INSERT INTO credit_status (id, customer_id, month, interest_rate, num_of_loan, type_of_loan, delay_from_due_date, num_of_delayed_payment, credit_mix, credit_history_age, payment_of_min_amount, payment_behaviour, monthly_balance) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const { id, customerId, month, interestRate, numOfLoan, typeOfLoan, delayFromDueDate, numOfDelayedPayment, 
        creditMix, creditHistoryAge, paymentOfMinAmount, paymentBehaviour, monthlyBalance } = req.body;
    const values = [id, customerId, month, interestRate, numOfLoan, typeOfLoan, delayFromDueDate, numOfDelayedPayment, 
        creditMix, creditHistoryAge, paymentOfMinAmount, paymentBehaviour, monthlyBalance];

    try {
      mysqlConnection.query(query, values, (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: 'Internal Server Error' });
        } else {
          const newCreditStatus = {
            id: id, 
            customer_id: customerId, 
            month: month, 
            interesrt_rate: interestRate, 
            num_of_loan: numOfLoan, 
            type_of_loan: typeOfLoan, 
            delay_from_due_date: delayFromDueDate, 
            num_of_delayed_payment: numOfDelayedPayment, 
            credit_mix: creditMix, 
            credit_history_age: creditHistoryAge, 
            payment_of_min_amount: paymentOfMinAmount, 
            payment_behaviour: paymentBehaviour, 
            monthly_balance: monthlyBalance
          };
          console.log(newCreditStatus);
          return res.status(201).json(newCreditStatus);
        }
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }


  // -------------------------------------------------------------------------------- PUT /credit-status/:id
  async putCreditStatus(req, res) {
    const id = req.params.id;
    const queryCheck = 'SELECT * FROM credit_status WHERE id = ?';
    const queryUpdate = 'UPDATE credit_status SET customer_id = ?, month = ?, interest_rate = ?, num_of_loan = ?, type_of_loan = ?, delay_from_due_date = ?, num_of_delayed_payment = ?, credit_mix = ?, credit_history_age = ?, payment_of_min_amount = ?, payment_behaviour = ?, monthly_balance = ? WHERE id = ?';
    const { customerId, month, interestRate, numOfLoan, typeOfLoan, delayFromDueDate, numOfDelayedPayment, 
        creditMix, creditHistoryAge, paymentOfMinAmount, paymentBehaviour, monthlyBalance } = req.body;
    const valuesCheck = [id];
   
    mysqlConnection.query(queryCheck, valuesCheck, (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Credit Status not found' });
      }
  
      const valuesUpdate = [customerId, month, interestRate, numOfLoan, typeOfLoan, delayFromDueDate, numOfDelayedPayment, 
        creditMix, creditHistoryAge, paymentOfMinAmount, paymentBehaviour, monthlyBalance, id];
  
      try {
        mysqlConnection.query(queryUpdate, valuesUpdate, (err, results) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
          } else {
            const updatedCreditStatus = {
                id: id, 
                customer_id: customerId, 
                month: month, 
                interesrt_rate: interestRate, 
                num_of_loan: numOfLoan, 
                type_of_loan: typeOfLoan, 
                delay_from_due_date: delayFromDueDate, 
                num_of_delayed_payment: numOfDelayedPayment, 
                credit_mix: creditMix, 
                credit_history_age: creditHistoryAge, 
                payment_of_min_amount: paymentOfMinAmount, 
                payment_behaviour: paymentBehaviour, 
                monthly_balance: monthlyBalance
            };
            console.log(updatedCreditStatus);
            return res.status(200).json(updatedCreditStatus);
          }
        });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    });
  }
}

export default CreditStatusController;