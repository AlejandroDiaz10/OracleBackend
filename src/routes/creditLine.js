import { Router } from "express";
import CreditLineController from "../controllers/creditLineController.js";
import ROUTES from "./constants.js";

const creditLineRouter = Router();
const controller = new CreditLineController();

creditLineRouter.get(ROUTES.CREDIT_LINE, controller.getAllCreditLines);
creditLineRouter.get(ROUTES.CREDIT_LINE + "/:id", controller.getCreditLineById);
creditLineRouter.post(ROUTES.CREDIT_LINE, controller.postCreditLine);
creditLineRouter.put(ROUTES.CREDIT_LINE + "/:id", controller.putCreditLine);

export default creditLineRouter; 