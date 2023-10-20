class CreditStatus {
    constructor(id, customerId, month, interestRate, numOfLoan, typeOfLoan, delayFromDueDate, numOfDelayedPayment, 
        creditMix, creditHistoryAge, paymentOfMinAmount, paymentBehaviour, monthlyBalance) {
            this.id = id;
            this.customerId = customerId;
            this.month = month;
            this.interestRate = interestRate;
            this.numOfLoan = numOfLoan;
            this.typeOfLoan = typeOfLoan;
            this.delayFromDueDate = delayFromDueDate;
            this.numOfDelayedPayment = numOfDelayedPayment;
            this.creditMix = creditMix;
            this.creditHistoryAge = creditHistoryAge;
            this.paymentOfMinAmount = paymentOfMinAmount;
            this.paymentBehaviour = paymentBehaviour;
            this.monthlyBalance = monthlyBalance;
    }
  }
  
export default CreditStatus;