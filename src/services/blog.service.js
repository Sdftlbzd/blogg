import { Blog } from "../models/blog.model.js";

const create = async (data, userId, photo, photos) => {
  try {
    const newBlog = await Blog.create({
      ...data,
      userId: userId,
      photo: photo?.[0].filename,
      photos: photos?.map(file => file.path),
    });
    console.log(photo)
    return newBlog;
  } catch (error) {
    throw error;
  }
};

export const BlogService = {
  create,
};
