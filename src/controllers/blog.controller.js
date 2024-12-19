import Joi from "joi";
import jwt from "jsonwebtoken";
import "dotenv/config";
import path from "path";
import { User } from "../models/user.model.js";
import { Blog } from "../models/blog.model.js";
import { BlogService } from "../services/blog.service.js";

const create = async (req, res, next) => {
  const data = await Joi.object({
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

  try {
    const newBlog = await BlogService.create(data, req.user._id, req.files.photo, req.files.photos);
  
    res.status(200).json(newBlog) 
  } catch (error) {
    next(error)
  }
  // if(newBlog) res.status(201).json(newBlog)
  // else{(error) =>
  //     res.status(500).json({
  //       message: "Xeta bash verdi!",
  //       error,
  //     })
  //   };
  //   await newBlog.save()
};

const blogs = async (req, res, next) => {
  try {
    // const list = await Blog.find().populate("user", "fullname").select("_id title user")

    const blogs = await Blog.find({ userId: req.params.userId });

    res.json(blogs);
  } catch (error) {
    res.json({
      message: "Xeta bash Verdi!",
      error,
    });
  }
};

const getById = async (req, res, next) => {
  const id = req.params.id;
  if (!id)
    return res.json({
      message: "Id required",
    });
  const blog = await Blog.findById(id).populate('userId', 'name surname');

  res.json(blog);
};

const BlogEdit = async (req, res, next) => {
  const { title, description } = await Joi.object({
    title: Joi.string().trim().min(3).max(50),
    description: Joi.string().trim().min(10).max(1000),
  })
    .validateAsync(req.body, { abortEarly: false })
    .catch((err) => {
      return res.status(422).json({
        message: "Xeta bash verdi!",
        error: err.details.map((item) => item.message),
      });
    });

// const photoPath = req.files?.photo?.[0].filename;
// const photosPaths = req.files?.photos?.map(file => file.path);

  const blog = await Blog.findById({
    _id: req.params.id,
  });

  if (!blog) return res.json("Bele bir blog yoxdur");
  //if (blog) return res.json(blog);
  // const updateBlog = await Blog.updateMany(
  //   { _id: req.params.id },
  //   { title: title, description: description, photo: req.file.path }
  // );


  const photoPath = req.files?.photo ? req.files.photo[0].path : blog.photo;
  const photosPaths = req.files?.photos ? req.files.photos.map(file => file.path) : blog.photos;

  const updateBlog = await Blog.updateMany(
    { _id: req.params.id },
    { title: title, description: description, photo: photoPath,  photos: photosPaths }
  );


  // Blogu yeniləyirik
  // const updatedBlog = await Blog.findByIdAndUpdate(
  //   {_id: req.params.id},
  //   {
  //     title: title || blog.title,
  //     description: description || blog.description,
  //     photo: photoPath,
  //     photos: photosPaths,
  //   } // Yenilənmiş blogu qaytarır
  // );

console.log(updateBlog)

  // if (updateBlog) {
  //   return res.json("Blog uğurla yeniləndi");
  // } else {
  //   return res.json("Heç bir dəyişiklik yoxdur");
  // }
  
  if (updateBlog.modifiedCount > 0) {
    return res.json("Blog uğurla yeniləndi");
  } else {
    res.json("Heç bir dəyişiklik yoxdur");
  }
};

const DeleteBlog = async (req, res, next) => {
  const id = req.params.id;

  const blog = await Blog.findOne({
    _id: id,
  });

  if (!blog) return res.json("Belə bir Blog yoxdur");

  const DeleteBlog = await Blog.deleteOne({
    _id: id,
  });

  res.send("Blog deleted successfully from database");
};

const DeleteAllBlogs = async (req, res, next) => {
  const DeleteBlogs = await Blog.deleteMany({
    userId: req.params.userId,
  });
  console.log(DeleteBlogs);

  res.send("All blogs deleted successfully from database");
};

export const BlogController = () => ({
  create,
  blogs,
  getById,
  BlogEdit,
  DeleteBlog,
  DeleteAllBlogs,
});
