import express from 'express'
import { Router } from "express";
import {  BlogController } from '../controllers/blog.controller.js';
export const BlogRouter = Router();

const controller = BlogController()


BlogRouter.get('/list',controller.list)
BlogRouter.get('/create',controller.create)