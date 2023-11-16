import { Router } from "express";
import BucketController from "../controllers/bucketController.js";
import ROUTES from "./constants.js";

const bucketRouter = Router();
const controller = new BucketController();

bucketRouter.get(ROUTES.BUCKETS, controller.getAllBuckets);
bucketRouter.post(ROUTES.BUCKETS, controller.postFile);

export default bucketRouter;