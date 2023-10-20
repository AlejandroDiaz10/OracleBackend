import { Router } from "express";
import CreditStatusController from "../controllers/creditStatusController.js";
import ROUTES from "./constants.js";

const creditStatusRouter = Router();
const controller = new CreditStatusController();

creditStatusRouter.get(ROUTES.CREDIT_STATUS, controller.getAllCreditStatus);
creditStatusRouter.get(ROUTES.CREDIT_STATUS + "/:id", controller.getCreditStatusById);
creditStatusRouter.post(ROUTES.CREDIT_STATUS, controller.postCreditStatus);
creditStatusRouter.put(ROUTES.CREDIT_STATUS + "/:id", controller.putCreditStatus);

export default creditStatusRouter; 