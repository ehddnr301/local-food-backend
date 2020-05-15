import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import axios from "axios";
import jwt from "jsonwebtoken";

export const postJoin = (req: Request, res: Response) => "postJoin";
export const postLogin = (req: Request, res: Response) => "postLogin";

export const getUserInfo = async (req: Request, res: Response) => {
  const {
    body: { userId },
  } = req;
  let decodedId;
  decodedId = jwt.verify(userId, process.env.JWT_SECRET);
  if (decodedId) {
    try {
      const user = await User.findById(decodedId.id);
      res
        .status(200)
        .json({
          email: user.email,
          username: user.username,
          avatarUrl: user.avatarUrl,
        })
        .end();
    } catch {
      res.status(400).send("Cant find User").end();
    }
  } else {
    res.status(400).send("Can't find User").end();
  }
};
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
        const id = user.id;
        const jwtToken = jwt.sign({ id }, process.env.JWT_SECRET, {
          expiresIn: "2h",
        });
        res.cookie("user", jwtToken);
        // res.status(200).json(user.id).end();
        res.status(200).json(jwtToken).end();
      }
    } else {
      const newUser = await User.create({
        email,
        username,
        avatarUrl,
      });
      const id = newUser.id;
      const jwtToken = jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });
      res.cookie("user", jwtToken);
      res.status(200).json(jwtToken).end();
    }
  } catch (err) {
    console.log(err);
  }
};

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
        const id = user.id;
        const jwtToken = jwt.sign({ id }, process.env.JWT_SECRET, {
          expiresIn: "2h",
        });
        res.cookie("user", jwtToken);
        // res.status(200).json(user.id).end();
        res.status(200).json(jwtToken).end();
      } else {
        const newUser = await User.create({
          email,
          username,
          avatarUrl,
        });
        const id = newUser.id;
        const jwtToken = jwt.sign({ id }, process.env.JWT_SECRET, {
          expiresIn: "2h",
        });
        res.cookie("user", jwtToken);
        res.status(200).json(jwtToken).end();
      }
    }
  } catch (err) {
    console.log(err);
  }
};
