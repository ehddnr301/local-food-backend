import express from "express";
import {
  getRestaurants,
  putStore,
  postStore,
  deleteStore,
  getCafes,
  getPubs,
  getAll,
  reverseGeo,
} from "../controllers/storeController";

const storeRouter = express.Router();

// 리스트를 제공합니다.
storeRouter.get("/list/restaurant", getRestaurants);
storeRouter.get("/list/cafe", getCafes);
storeRouter.get("/list/pub", getPubs);
storeRouter.get("/list/all", getAll);

// 리스트에 값을 추가합니다.
storeRouter.post("/list", postStore);

// 값을 수정합니다. 별점시스템 ?
storeRouter.put("/:id", putStore);

// 값을 제거합니다.
storeRouter.delete("/:id", deleteStore);

// 위도 경도 얻기
// storeRouter.get("/geoAll", getAllGeo);

// 현재 좌표 를 주소로 변환
storeRouter.post("/reverseGeo", reverseGeo);

export default storeRouter;
