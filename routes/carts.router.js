import { Router } from "express";
import {
  getCartsController,
  getCartByIdController,
  createCartController,
  addProductToCartController,
  deleteProductToCartController,
  deleteProductFromCartController,
  updateProductQuantityController,
} from "../controllers/carts.controllers.js";

import { finalizePurchase,
  getTicketByCodeController, } from "../controllers/ticket.controller.js";

import { authorizedUser } from "../middlewares/userAuthentication.js";

const router = Router();

router.get("/", getCartsController);
router.get("/:cid", getCartByIdController);
router.post("/", createCartController);
// router.post("/:cid/product/:pid", addProductToCartController);
router.post("/:cid/product/:pid", authorizedUser, addProductToCartController);
router.put("/:cid/product/:pid", updateProductQuantityController);
router.delete("/:cid", deleteProductToCartController);
router.delete("/:cid/product/:pid", deleteProductFromCartController);
router.post("/:cid/purchase", finalizePurchase);
router.get("/purchase/:code", getTicketByCodeController);

export default router;
