import mongoose from "mongoose";
import { IUser } from "./User";

export interface IStore extends mongoose.Document {
  storeName: string;
  storeType: string;
  location: string;
  description: string;
  creator: IUser;
  createAt: Date;
  likes: number;
}

const StoreSchema: mongoose.Schema<IStore> = new mongoose.Schema({
  storeName: {
    required: "storeName is required",
    type: String,
  },
  storeType: {
    required: "storeType is required",
    type: String,
  },
  location: {
    required: "location is required",
    type: String,
  },
  description: String,
  creator: {
    ref: "User",
    type: mongoose.Schema.Types.ObjectId,
  },
  createdAt: {
    default: Date.now,
    type: Date,
  },
  likes: {
    default: 0,
    type: Number,
  },
});

const model = mongoose.model<IStore & mongoose.Document>("Store", StoreSchema);

export default model;
