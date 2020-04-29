import path from "path";
import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
import bodyParser from "body-parser";
import passport from "passport";
import session from "express-session";
import mongoose from "mongoose";
import foodRouter from "./api/routers/foodRouter";
import userRouter from "./api/routers/userRouter";

const app = express();

const CookieStore = MongoStore(session);

app.use(helmet());
app.use("/uploads", express.static("uploads"));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: true,
    saveUninitialized: false,
    store: new CookieStore({ mongooseConnection: mongoose.connection }),
  })
);
app.use(morgan("dev"));

app.use(passport.initialize());
app.use(passport.session());

// 음식점, 카페, 술집 분류 예정
app.use("/food", foodRouter);

app.use("/user", userRouter);

app.use(morgan("dev"));

export default app;
