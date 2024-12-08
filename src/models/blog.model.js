import mongoose from "mongoose";

const BlogShema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
    trim: true,
  },
  description: {
    type: String,
    require: true,
    trim: true,
  },
  userId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true
  }],
});

export const Blog = mongoose.model("Blog", BlogShema);
