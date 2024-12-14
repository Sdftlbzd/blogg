import Joi from "joi";
import jwt from "jsonwebtoken";
import "dotenv/config";
import path from "path"
import { User } from "../models/user.model.js";
import { Blog } from "../models/blog.model.js";

const create = async (req, res, next) => {
 
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
    userId: req.user._id,
    photo: req.file.path
  })
  
  if(newBlog) res.status(201).json(newBlog)
  else{(error) =>
      res.status(500).json({
        message: "Xeta bash verdi!",
        error,
      })
    };
    await newBlog.save()
};

const blogs = async (req, res, next) => {
  try {
     // const list = await Blog.find().populate("user", "fullname").select("_id title user")

     const blogs = await Blog.find({userId: req.params.userId});

      res.json(blogs)
  } catch (error) {
      res.json({
          message: "Xeta bash Verdi!",
          error,
      })
  }
}

const getById = async (req, res, next) => {
  const id = req.params.id;
  if (!id) return res.json({
      message: "Id required",
  })
  const blog = await Blog.findById(id)

  res.json(blog)
}

const BlogEdit = async(req, res, next) => {
    
  const { title, description } = await Joi.object({
    title: Joi.string().trim().min(3).max(50).required(),
    description: Joi.string().trim().min(10).max(1000).required(),
    photo: Joi.string()
  }).validateAsync(req.body, { abortEarly: false })
    .catch((err) => {
      return res.status(422).json({
        message: "Xeta bash verdi!",
        error: err.details.map((item) => item.message),
      });
      });

      const blog = await Blog.findById({
        _id: req.params.id,
      });

 if(!blog) return res.json("Bele bir blog yoxdur")

  const updateBlog = await Blog.updateMany(
      { _id: req.params.id },        
      { title: title,
        description: description,
       photo: req.file.path
      }       
    );
console.log(updateBlog.modifiedCount)
    if (updateBlog.modifiedCount > 0 ) {
      return res.json('Blog uğurla yeniləndi');
    } else {
      res.json('Heç bir dəyişiklik yoxdur');}
    
};

const DeleteBlog = async(req, res, next) =>{
  const id = req.params.id

  const blog = await Blog.findOne({
      _id: id,
    });    

  if(!blog) return res.json("Belə bir Blog yoxdur")

  const DeleteBlog = await Blog.deleteOne({
      _id: id,
    });    

  res.send("Blog deleted successfully from database");
};

const DeleteAllBlogs = async(req, res, next) =>{

  const DeleteBlogs = await Blog.deleteMany({
      userId: req.params.userId,
    });    
console.log(DeleteBlogs)

  res.send("All blogs deleted successfully from database");
};

export const BlogController = () => ({ create, blogs, getById, BlogEdit, DeleteBlog, DeleteAllBlogs });
