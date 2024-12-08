
import mongoose from "mongoose";
import { type } from "os";

const UserShema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    trim: true,
  },
  surname: {
    type: String,
    require: true,
    trim: true,
  },
  age: {
    type: Number,
    require: true,
    trim: true,
  },
  email: {
    type: String,
    require: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
    trim: true,
  },
  token: {
    type: String,
    require: true,
    trim: true,
  },
  blogId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
  ],
  isVerifiedEmail: {
    type: Boolean,
    default: null,
  },
  verifyCode: {
    type: Number,
    default: null,
  },
  verifyExpiredIn: {
    type: Date,
    default: null,
  },
  uuidToken:{
    type:String,
    default:null
  },
  resetExpiredIn:{
    type: Date,
    default: null
}
});

export const User = mongoose.model("User", UserShema);
