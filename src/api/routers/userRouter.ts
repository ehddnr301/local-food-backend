import express from "express";
import passport from "passport";
import {
  postJoin,
  postLogin,
  getUserInfo,
  putUserInfo,
  deleteUser,
  kakaoLogin,
  githubLogin,
  googleLogin,
} from "../controllers/userController";

const userRouter = express.Router();

userRouter.post("/join", postJoin);

userRouter.post("/login", postLogin);

// 유저를 제공합니다.
userRouter.get("/:id", getUserInfo);
userRouter.post("/me", getUserInfo);

// 유저정보를 수정합니다. ex 위치?
userRouter.put("/:id", putUserInfo);

// 유저를 제거합니다.
userRouter.delete("/:id", deleteUser);

userRouter.post("/auth/github", githubLogin);

userRouter.post("/auth/kakao", kakaoLogin);

userRouter.post("/auth/google", googleLogin);

export default userRouter;
