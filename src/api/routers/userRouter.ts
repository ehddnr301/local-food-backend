import express from "express";
import passport from "passport";
import {
  postJoin,
  postLogin,
  getUserInfo,
  putUserInfo,
  deleteUser,
  postGithubLogIn,
  postKakaoLogIn,
  kakaoLogin,
  githubLogin,
} from "../controllers/userController";

const userRouter = express.Router();

userRouter.post("/join", postJoin);

userRouter.post("/login", postLogin);

// 유저를 제공합니다.
userRouter.get("/:id", getUserInfo);

// 유저정보를 수정합니다. ex 위치?
userRouter.put("/:id", putUserInfo);

// 유저를 제거합니다.
userRouter.delete("/:id", deleteUser);

userRouter.get("/auth/github", githubLogin);

userRouter.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  postGithubLogIn
);

userRouter.get("/auth/kakao", kakaoLogin);
userRouter.get(
  "/auth/kakao/callback",
  passport.authenticate("kakao", { failureRedirect: "/login" }),
  postKakaoLogIn
);

export default userRouter;
