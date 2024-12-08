import express from 'express'
import { Router } from "express";
import {  BlogController } from '../controllers/blog.controller.js';
import { useAuth } from '../middlewares/user.middleware.js';
export const BlogRouter = Router();

const controller = BlogController()


//BlogRouter.post('/list',controller.list)
BlogRouter.post('/create',useAuth,controller.create)