import { Request, Response, NextFunction } from "express";

export const getRestaurants = (req: Request, res: Response) => "getRestaurants";
export const postRestaurant = (req: Request, res: Response) => "postRestaurant";
export const putRestaurant = (req: Request, res: Response) => "putRestaurant";
export const deleteRestaurant = (req: Request, res: Response) =>
  "deleteRestaurant";
