import { Router } from "express";
import ProductController from "../controllers/productController.js";
import ROUTES from "./constants.js";

const productRouter = Router();
const controller = new ProductController();

productRouter.get(ROUTES.ELASTIC_SEARCH + "/products", controller.getAll);
productRouter.post(ROUTES.ELASTIC_SEARCH + "/products" + "/description", controller.getByDescription);

productRouter.get(ROUTES.PRODUCTS, controller.getAllProducts);
productRouter.get(ROUTES.PRODUCTS + "/:id", controller.getProductById);
productRouter.post(ROUTES.PRODUCTS, controller.postProduct);
productRouter.put(ROUTES.PRODUCTS + "/:id", controller.putProduct);

export default productRouter;  