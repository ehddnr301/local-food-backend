import { Request, Response, NextFunction } from "express";
import passport from "passport";
import User from "../models/User";
import axios from "axios";
import jwt from "jsonwebtoken";

export const postJoin = (req: Request, res: Response) => "postJoin";
export const postLogin = (req: Request, res: Response) => "postLogin";
export const getUserInfo = (req: Request, res: Response) => "getUserInfo";
export const putUserInfo = (req: Request, res: Response) => "putUserInfo";
export const deleteUser = (req: Request, res: Response) => "deleteUser";

// export const githubLogin = passport.authenticate("github");
export const githubLogin = async (req: Request, res: Response) => {
  const { code } = req.body;
  const GH_ID = process.env.GH_ID;
  const GH_SECRET = process.env.GH_SECRET;
  try {
    const response = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        code,
        client_id: GH_ID, // 내 APP의 정보
        client_secret: GH_SECRET, // 내 APP의 정보
      },
      {
        headers: {
          accept: "application/json",
        },
      }
    );
    const token = response.data.access_token;
    const {
      data: { email, login: username, avatar_url: avatarUrl },
    } = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `token ${token}`,
      },
    });
    if (email) {
      const user = await User.findOne({ email });
      console.log(user);
      if (user) {
        res.json(user).end();
      }
    } else {
      const newUser = await User.create({
        email,
        username,
        avatarUrl,
      });
      res.json(newUser).end();
    }
  } catch (err) {
    console.log(err);
  }
};
// export const kakaoLogin = passport.authenticate("kakao");

export const kakaoLogin = async (req: Request, res: Response) => {
  const { code } = req.body;
  try {
    const response = await axios.get(
      `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${process.env.KAKAO_KEY}&redirect_uri=${process.env.KAKAO_CALLBACK}&code=${code}&client_secret=${process.env.KAKAO_SECRET}`
    );
    const {
      data: { access_token },
    } = response;
    const profileRequest = await axios.get(
      "https://kapi.kakao.com/v2/user/me",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );
    const {
      data: {
        properties: { nickname: username },
        kakao_account: {
          email,
          profile: { profile_image_url: avatarUrl },
        },
      },
    } = profileRequest;
    if (email) {
      const user = await User.findOne({ email });
      console.log(user);
      if (user) {
        console.log("hi");
        res.json(user).end();
      } else {
        console.log("hello");
        const newUser = await User.create({
          email,
          username,
          avatarUrl,
        });
        console.log(newUser);
        res.json(newUser).end();
      }
    }
  } catch (err) {
    console.log(err);
  }
};

export const postGithubLogIn = (req: Request, res: Response) => {
  console.log("hi");
  res.redirect("/");
};
export const postKakaoLogIn = (req: Request, res: Response) => {
  res.redirect("/");
};

export const githubLoginCallback = async (
  _: any,
  __: any,
  profile: UserResponse,
  cb: any
) => {
  console.log("hi");
  const {
    _json: { avatar_url, name, email },
  } = profile;
  try {
    console.log("hi");
    const user = await User.findOne({ email });
    if (user) {
      return cb(null, user);
    }
    const newUser = await User.create({
      githubEmail: email,
      username: name,
      avatarUrl: avatar_url,
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
};

export const kakaoLoginCallback = async (
  _: any,
  __: any,
  profile: KUserResponse,
  cb: any
) => {
  const {
    _raw,
    _json: {
      properties: { nickname },
      kakao_account: { email },
    },
  } = profile;
  let profileImage: string;
  if (_raw.includes("profile_image_url")) {
    const a = _raw.split(",");
    const c = a.filter((b) => b.includes("profile_image_url"));
    const d = c[0].split(":")[2].slice(0, -2);
    profileImage = `http:${d}`;
  }
  try {
    const user = await User.findOne({ email });
    if (user) {
      return cb(null, user);
    }
    const newUser = await User.create({
      kakaoEmail: email,
      username: nickname,
      avatarUrl: profileImage,
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
};
