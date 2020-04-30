import { Request, Response, NextFunction } from "express";
import passport from "passport";
import User from "../models/User";

export const postJoin = (req: Request, res: Response) => "postJoin";
export const postLogin = (req: Request, res: Response) => "postLogin";
export const getUserInfo = (req: Request, res: Response) => "getUserInfo";
export const putUserInfo = (req: Request, res: Response) => "putUserInfo";
export const deleteUser = (req: Request, res: Response) => "deleteUser";

export const githubLogin = passport.authenticate("github");
export const kakaoLogin = passport.authenticate("kakao");

export const postGithubLogIn = (req: Request, res: Response) => {
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
  const {
    _json: { avatar_url, name, email },
  } = profile;
  try {
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
