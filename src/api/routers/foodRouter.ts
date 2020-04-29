import express from "express";
import {
  getRestaurants,
  postRestaurant,
  putRestaurant,
  deleteRestaurant,
} from "../controllers/foodController";

const foodRouter = express.Router();

// 리스트를 제공합니다.
foodRouter.get("/list", getRestaurants);

// 리스트에 값을 추가합니다.
foodRouter.post("/list", postRestaurant);

// 값을 수정합니다. 별점시스템 ?
foodRouter.put("/:id", putRestaurant);

// 값을 제거합니다.
foodRouter.delete("/:id", deleteRestaurant);

export default foodRouter;
