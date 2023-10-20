import { Router } from "express";
import CustomerController from "../controllers/customerController.js";
import ROUTES from "./constants.js";

const customerRouter = Router();
const controller = new CustomerController();

customerRouter.get(ROUTES.CUSTOMERS, controller.getAllCustomers);
customerRouter.get(ROUTES.CUSTOMERS + "/:id", controller.getCustomerById);
customerRouter.post(ROUTES.CUSTOMERS, controller.postCustomer);
customerRouter.put(ROUTES.CUSTOMERS + "/:id", controller.putCustomer);

export default customerRouter; 