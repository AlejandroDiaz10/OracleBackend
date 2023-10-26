import { Router } from "express";
import OrderController from "../controllers/orderController.js";
import ROUTES from "./constants.js";

const orderRouter = Router();
const controller = new OrderController();

orderRouter.get(ROUTES.ORDERS + "/test/:column", controller.test);

orderRouter.get(ROUTES.ORDERS, controller.getAllOrders);
orderRouter.get(ROUTES.ORDERS + "/:orderLineId", controller.getOrderById);
orderRouter.get(ROUTES.ORDERS + "/customer/:customerId", controller.getOrdersByCustomerId);
orderRouter.post(ROUTES.ORDERS, controller.postOrder);
orderRouter.put(ROUTES.ORDERS + "/:orderLineId", controller.putOrder);

export default orderRouter; 