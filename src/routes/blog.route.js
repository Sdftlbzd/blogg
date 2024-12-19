import express from 'express'
import { Router } from "express";
import {  BlogController } from '../controllers/blog.controller.js';
import { useAuth } from '../middlewares/user.middleware.js';
import { uploads } from '../middlewares/multer.middleware.js';
export const BlogRouter = Router();

const controller = BlogController()


BlogRouter.post('/create',useAuth,uploads.fields([
    { name: 'photo', maxCount: 1 }, // Təkli fayl üçün
    { name: 'photos', maxCount: 5 } // Çoxlu fayllar üçün
]),controller.create)
BlogRouter.get("/:userId/list", controller.blogs)
BlogRouter.get("/:id", controller.getById)
BlogRouter.post('/update/:id',useAuth, controller.BlogEdit)
BlogRouter.delete('/deleteblog/:id',useAuth, controller.DeleteBlog)
BlogRouter.delete('/deleteblogs/:userId',useAuth, controller.DeleteAllBlogs)