import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import compression from "compression";
import helmet from "helmet";
import { decodeToken } from "./app/auth/middleware";

// router
import productRouter from "./app/product/router";
import categoryRouter from "./app/category/router";
import tagRouter from "./app/tag/router";
import authRouter from "./app/auth/router";
import wilayahRouter from "./app/wilayah/router";
import deliveryRouter from "./app/delivery-address/router";
import cartController from "./app/cart/router";

const app = express();

// view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(compression());
app.use(helmet());
app.use(decodeToken());

// use router
app.use("/api", productRouter);
app.use("/api", categoryRouter);
app.use("/api", tagRouter);
app.use("/api", wilayahRouter);
app.use("/api", deliveryRouter);
app.use("/api", cartController);
app.use("/auth", authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export { app };
