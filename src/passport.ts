// import passport from "passport";
// import GithubStrategy from "passport-github";
// import { Strategy as KaKaoStrategy } from "passport-kakao";
// import User from "./api/models/User";
// import {
//   githubLoginCallback,
//   kakaoLoginCallback,
// } from "./api/controllers/userController";

// passport.use(
//   new GithubStrategy(
//     {
//       clientID: process.env.GH_ID,
//       clientSecret: process.env.GH_SECRET,
//       callbackURL: `http://localhost:4000/user/auth/github/callback`,
//     },
//     githubLoginCallback
//   )
// );

// passport.use(
//   new KaKaoStrategy(
//     {
//       clientID: process.env.KAKAO_KEY,
//       clientSecret: process.env.KAKAO_SECRET,
//       callbackURL: `http://localhost:4000/user/auth/kakao/callback`,
//     },
//     kakaoLoginCallback
//   )
// );

// passport.use(User.createStrategy());

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
