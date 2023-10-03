import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import { __dirname } from "./path.js";
// import usersRouter from "./routes/users.router.js";

import MongoStore from "connect-mongo";
import { Server } from "socket.io";
import { errorHandler } from "./middlewares/errorHandler.js";
import allRouters from "./routes/index.js";
import "./db/dbConfig.js";
import mongoStore from "connect-mongo";
import handlebars from "express-handlebars";
// import viewsRouter from "./routes/views.router.js";
import passport from "passport";
import "./passports/passport.config.js";
import "./passports/passport.github.js";
import { logger } from "./utils/logger.js";

import swaggerUI from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import {info} from "./docs/info.js";

import MessagesDaoMongo from "./persistence/daos/mongodb/messages.dao.js";
const messagesManager = new MessagesDaoMongo();

const app = express();
const PORT = 8080;

const specs = swaggerJSDoc(info);
app.use("/docs", swaggerUI.serve, swaggerUI.setup(specs));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(__dirname + "/public"));
app.use(errorHandler);

app.engine(
  "handlebars",
  handlebars.engine({
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
  })
);
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

app.use(
  session({
    secret: "sessionKey",
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
      mongoUrl:
        "mongodb+srv://admin:test@cluster0.evgxseo.mongodb.net/ecommerce?retryWrites=true&w=majority",
      ttl: 15,
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/", allRouters);

const httpServer = app.listen(PORT, () => {
  logger.info("🚀 Server conectado al puerto 8080");
});

const socketServer = new Server(httpServer);

socketServer.on("connection", async (socket) => {
  logger.info("¡🟢 Nueva conexion!", socket.id);

  socketServer.emit("messages", await messagesManager.getAllMessages());

  socket.on("disconnect", () => {
    logger.info("¡🔴 Usuario Desconectado!");
  });

  socket.on("newUser", (userName) => {
    logger.info(`${userName} se loggeo`);
  });

  socket.on("chat:message", async ({ userName, message }) => {
    await messagesManager.createMessage(userName, message);
    socketServer.emit("messages", await messagesManager.getAllMessages());
  });

  socket.on("newUser", (userName) => {
    socket.broadcast.emit("newUser", userName);
  });

  socket.on("chat:typing", (data) => {
    socket.broadcast.emit("chat:typing", data);
  });
});
