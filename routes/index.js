import { Router } from "express";
import { isLogged } from "../middlewares/isLogged.js";

import productsRouter from "./products.router.js";
import cartsRouter from "./carts.router.js";
import messagesRouter from "./messages.router.js";
import productsView from "./productsView.router.js";
import viewsRouter from "./views.router.js";
import usersRouter from "./users.router.js";
import mockProductsRouter from "./productsMock.router.js";
import loggerTestRouter from "./logger.router.js"

const router = Router();

router.use("/api/products", productsRouter);
router.use("/api/carts", cartsRouter);

router.use("/messages", messagesRouter);
router.use("/products", isLogged, productsView);
router.use("/views", viewsRouter);

router.use("/mockingproducts", mockProductsRouter);

router.use("/loggerTest", loggerTestRouter);

router.use("/users", usersRouter);

export default router;
