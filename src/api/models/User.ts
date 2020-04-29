import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

export interface IUser extends mongoose.Document {
  _id: string;
  avatarUrl: string;
  googleEmail: string;
  githubEmail: string;
  kakaoEmail: string;
  username: string;
}

const UserSchema: mongoose.PassportLocalSchema = new mongoose.Schema({
  avatarUrl: String,
  googleEmail: String,
  githubEmail: String,
  kakaoEmail: String,
  username: String,
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
