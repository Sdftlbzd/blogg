import mongoose from "mongoose";

const BlogShema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  photo:{
    type:String,
    default:null,
    trim: true,
  },
  photos:[{
    type:String,
    default:null,
    trim: true,
  }],
});

export const Blog = mongoose.model("Blog", BlogShema);
