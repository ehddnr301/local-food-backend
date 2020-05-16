import { Request, Response, NextFunction } from "express";
import Store from "../models/Store";
import jwt from "jsonwebtoken";

// TODO : naver api 에서 주소를 lang long 으로 변환하는것 구현

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
export const postStore = async (req: Request, res: Response) => {
  try {
    const {
      body: { storeName, storeType, location, description, id },
    } = req;
    let decodedId;
    decodedId = jwt.verify(id, process.env.JWT_SECRET);
    const newStore = await Store.create({
      storeName,
      storeType,
      location,
      description,
      creator: decodedId.id,
    });
    console.log(newStore);
    // User를 req에 담아야 유저생성이 자연스러울듯!
  } catch (error) {
    console.log(error);
    res.status(400).end();
  }
};
export const putStore = (req: Request, res: Response) => "putRestaurant";
export const deleteStore = async (req: Request, res: Response) => {
  try {
    const {
      body: { id },
    } = req;
    await Store.findOneAndDelete(id);
  } catch {
    res.status(400).end();
  }
};
