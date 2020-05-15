import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
import bodyParser from "body-parser";
import passport from "passport";
import session from "express-session";
import mongoose from "mongoose";
import storeRouter from "./api/routers/storeRouter";
import userRouter from "./api/routers/userRouter";
import "./passport";

const app = express();

const CookieStore = MongoStore(session);
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

app.use(helmet());
app.use("/uploads", express.static("uploads"));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: true,
    store: new CookieStore({ mongooseConnection: mongoose.connection }),
  })
);
app.use(morgan("dev"));

// storeType 으로 음식점, 카페, 술집 분류 예정
app.use("/store", storeRouter);

app.use("/user", userRouter);

app.use(morgan("dev"));

export default app;
