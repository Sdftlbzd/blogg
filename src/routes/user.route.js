import express from 'express'
import { Router } from "express";
import {  UserController } from '../controllers/user.controller.js';
export const UserRouter = Router();

const controller= UserController()

UserRouter.get('/login',controller.login)
UserRouter.get('/signin',controller.signin)