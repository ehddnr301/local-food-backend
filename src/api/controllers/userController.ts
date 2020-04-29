import { Request, Response, NextFunction } from "express";

export const postJoin = (req: Request, res: Response) => "postJoin";
export const postLogin = (req: Request, res: Response) => "postLogin";
export const getUserInfo = (req: Request, res: Response) => "getUserInfo";
export const putUserInfo = (req: Request, res: Response) => "putUserInfo";
export const deleteUser = (req: Request, res: Response) => "deleteUser";
