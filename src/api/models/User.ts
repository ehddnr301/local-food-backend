import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

export interface IUser extends mongoose.Document {
  _id: string;
  avatarUrl: string;
  email: string;
  username: string;
}

const UserSchema: mongoose.PassportLocalSchema = new mongoose.Schema({
  avatarUrl: String,
  email: String,
  username: {
    required: "Username is required",
    type: String,
  },
  store: [
    {
      ref: "Store",
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
});

UserSchema.plugin(passportLocalMongoose, { usernameField: "email" });

const model = mongoose.model<IUser & mongoose.Document>("User", UserSchema);

export default model;
