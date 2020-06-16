import { Request, Response, NextFunction } from "express";
import axios from "axios";
import Store from "../models/Store";
import User from "../models/User";
import jwt from "jsonwebtoken";

// TODO : 자기 위치 근처의 정보들 얻기도 만들기

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

export const getLikedStore = async (req: Request, res: Response) => {
  try {
    const {
      body: { userId },
    } = req;
    let decodedId;
    decodedId = jwt.verify(userId, process.env.JWT_SECRET);
    const user = await User.findById(decodedId.id).populate({
      model: "Store",
      path: "stores",
    });
    const storeArr = user.stores.map((store) => {
      return {
        name: store.storeName,
        type: store.storeType,
        location: store.location,
        description: store.description,
      };
    });
    res.status(200).json(storeArr).end();
  } catch (error) {
    console.log(error);
  }
};

// TODO : like수 조절하기.
// * 담기
export const toggleLike = async (req: Request, res: Response) => {
  try {
    const {
      body: {
        store: { _id: id, likes },
        userId,
      },
    } = req;
    let decodedId;
    decodedId = jwt.verify(userId, process.env.JWT_SECRET);
    const user = await User.findById(decodedId.id);
    if (user.stores.includes(id)) {
      user.stores.pull(id);
      user.save();
      res.status(200).json("OUT").end();
    } else {
      user.stores.push(id);
      user.save();
      res.status(200).json("IN").end();
    }
  } catch (error) {
    console.log(error);
  }
};

export const reverseGeo = async (req: Request, res: Response) => {
  try {
    const {
      body: { lat, lng },
    } = req;
    const response = await axios.get(
      `https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc?coords=${lng},${lat}&output=json&orders=addr`,
      {
        headers: {
          "X-NCP-APIGW-API-KEY-ID": process.env.NAVER_ID,
          "X-NCP-APIGW-API-KEY": process.env.NAVER_SECRET,
        },
      }
    );
    if (response.status === 200) {
      const area1 = response.data.results[0].region.area1.name;
      const area2 = response.data.results[0].region.area2.name;
      const area3 = response.data.results[0].region.area3.name;
      const num1 = response.data.results[0].land.number1;
      const num2 = response.data.results[0].land.number2;
      console.log(area1, area2, area3, num1, num2);
      if (num2 !== "") {
        const address =
          area1 + " " + area2 + " " + area3 + " " + num1 + "-" + num2;
        res.status(200).json(address).end();
      } else {
        const address = area1 + " " + area2 + " " + area3 + " " + num1;
        res.status(200).json(address).end();
      }
      // const {data: {results[0]: {region, land}}} = response;
    }
  } catch (error) {
    console.log(error);
  }
};

export const postStore = async (req: Request, res: Response) => {
  try {
    const {
      body: { storeName, storeType, location, description, id },
    } = req;
    console.log(storeType);
    console.log(location);
    // ID
    let decodedId;
    decodedId = jwt.verify(id, process.env.JWT_SECRET);

    // location
    // TODO : naver 문의 하였습니다.
    // * 경기도 부천시 원미구 역곡1동 역곡로 99-21 은 실패
    // * 역곡로 99-21 은 성공
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
    console.log(response);
    const addresses = response.data.addresses;
    let xCoordinate;
    let yCoordinate;
    if (addresses.length === 1) {
      xCoordinate = addresses[0].x;
      yCoordinate = addresses[0].y;

      await Store.create({
        storeName,
        storeType,
        location,
        description,
        xCoordinate,
        yCoordinate,
        creator: decodedId.id,
      });
      res.status(200).json("Success").end();
    } else {
      res.status(400).json("Fail").end();
    }
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
