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

  // GITHUB에서 제공하는 다양한 API에 접근할 수 있는 토큰 정보를 취득할 수 있습니다.

  // data의 정보를 활용하여 자신의 애플리케이션에 필요한 정보를 DB에 저장해주세요.

  // JWT 토큰을 발행합니다.
  // const accessToken = await jwt.generate({ login: data.login, id: data.id });

  // return res.json({ accessToken });
};
export const kakaoLogin = passport.authenticate("kakao");

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
