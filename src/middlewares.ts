import multer from "multer";
import { Request, Response, NextFunction } from "express";

const multerVideo = multer({ dest: "uploads/videos/" });
const multerAvatar = multer({ dest: "uploads/avatars/" });

export const localsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.locals.loggedUser = req.user || null;
  next();
};

export const uploadVideo = multerVideo.single("videoFile");
export const uploadAvatar = multerAvatar.single("avatar");
