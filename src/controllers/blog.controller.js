import Joi from "joi";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { User } from "../models/user.model.js";
import { Blog } from "../models/blog.model.js";

const create = async (req, res, next) => {
  //res.json({ user: req.user });

  const { title, description } = await Joi.object({
    title: Joi.string().trim().min(3).max(50).required(),
    description: Joi.string().trim().min(10).max(1000).required(),
  })
    .validateAsync(req.body, { abortEarly: false })
    .catch((err) => {
      return res.status(422).json({
        message: "Xeta bash verdi!",
        error: err.details.map((item) => item.message),
      });
    });

    const newBlog =await Blog.create({
    title,
    description,
    user: req.user._id,
  })
  
  if(newBlog) res.status(201).json(newBlog)
  else{(error) =>
      res.status(500).json({
        message: "Xeta bash verdi!",
        error,
      })
    };
};

export const BlogController = () => ({ create });
