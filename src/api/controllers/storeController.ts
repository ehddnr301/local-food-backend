import { Request, Response, NextFunction } from "express";
import axios from "axios";
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
export const getPubs = async (req: Request, res: Response) => {
  try {
    const allStore = await Store.find({});
    const pubs = allStore.filter((aS) => aS.storeType === "pub");
    res.status(200).json(pubs).end();
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
    // ID
    let decodedId;
    decodedId = jwt.verify(id, process.env.JWT_SECRET);

    // location
    const encodedLocation = encodeURI(location);
    const response = await axios.get(
      `https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=${encodedLocation}`,
      {
        headers: {
          "X-NCP-APIGW-API-KEY-ID": process.env.NAVER_ID,
          "X-NCP-APIGW-API-KEY": process.env.NAVER_SECRET,
        },
      }
    );
    const addresses = response.data.addresses;
    let xCoordinate;
    let yCoordinate;
    if (addresses.length === 1) {
      xCoordinate = addresses[0].x;
      yCoordinate = addresses[0].y;
    }

    await Store.create({
      storeName,
      storeType,
      location,
      description,
      xCoordinate,
      yCoordinate,
      creator: decodedId.id,
    });
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
    let decodedId;
    decodedId = jwt.verify(id, process.env.JWT_SECRET);
    await Store.findOneAndDelete(decodedId);
  } catch {
    res.status(400).end();
  }
};
