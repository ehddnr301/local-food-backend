import { Request, Response, NextFunction } from "express";
import Store from "../models/Store";

export const getRestaurants = async (req: Request, res: Response) => {
  try {
    const allStore = await Store.find({});
    const restaurants = allStore.filter((aS) => aS.storeType === "restaurant");
    res.status(200).json(restaurants).end();
  } catch {
    res.status(400).end();
  }
};
export const getCafes = async (req: Request, res: Response) => {
  try {
    const allStore = await Store.find({});
    const cafes = allStore.filter((aS) => aS.storeType === "cafe");
    res.status(200).json(cafes).end();
  } catch {
    res.status(400).end();
  }
};
export const getAlchols = async (req: Request, res: Response) => {
  try {
    const allStore = await Store.find({});
    const alcohols = allStore.filter((aS) => aS.storeType === "alcohol");
    res.status(200).json(alcohols).end();
  } catch {
    res.status(400).end();
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const allStore = await Store.find({});
    res.status(200).json(allStore).end();
  } catch {
    res.status(400).end();
  }
};
export const postRestaurant = (req: Request, res: Response) => "postRestaurant";
export const putRestaurant = (req: Request, res: Response) => "putRestaurant";
export const deleteRestaurant = (req: Request, res: Response) =>
  "deleteRestaurant";
