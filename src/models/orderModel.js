class Order {
    constructor(orderLineId, id, orderPriority, customerId, customerSegment, productId, productContainer, profit, 
        quantityOrdered, sales, discount, grossUnitPrice, shippingCost, shipMode, shipDate, orderDate) {
        this.orderLineId = orderLineId;
        this.id = id;
        this.orderPriority = orderPriority;
        this.customerId = customerId;
        this.customerSegment = customerSegment;
        this.productId = productId;
        this.productContainer = productContainer;
        this.profit = profit;
        this.quantityOrdered = quantityOrdered;
        this.sales = sales;
        this.discount = discount;
        this.grossUnitPrice = grossUnitPrice;
        this.shippingCost = shippingCost;
        this.shipMode = shipMode;
        this.shipDate = shipDate;
        this.orderDate = orderDate;
    }
  }
  
export default Order;