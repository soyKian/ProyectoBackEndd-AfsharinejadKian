import { Router } from "express";
import {
  getProductController,
  getProductByIdController,
  addProductController,
  updateProductController,
  deleteProductController,
} from "../controllers/products.controllers.js";
import { authorizedAdmin, authorizedPremium } from "../middlewares/userAuthentication.js";

const router = Router();


router.get("/", getProductController);
router.get("/:id", getProductByIdController);
router.post("/", authorizedPremium, addProductController);
router.put("/:id", authorizedAdmin, updateProductController);
router.delete("/:id",authorizedPremium,  deleteProductController);

/*
router.post("/", authorizedAdmin, addProductController);
router.put("/:id", authorizedAdmin, updateProductController);
router.delete("/:id", authorizedAdmin, deleteProductController);
*/
export default router;
