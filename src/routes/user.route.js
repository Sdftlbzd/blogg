import express from 'express'
import { Router } from "express";
import {  UserController } from '../controllers/user.controller.js';
import { useAuth } from '../middlewares/user.middleware.js';
export const UserRouter = Router();

const controller= UserController()

UserRouter.post('/signin',controller.signin)
UserRouter.post('/login',controller.login)
UserRouter.post('/Verify/Email',useAuth, controller.verifyEmail)
UserRouter.post('/Verify/Email/Check',useAuth, controller.checkVerifyCode)
UserRouter.post('/ForgetPass',controller.ForgetPass)
UserRouter.post('/CreatePass/:uuidToken',controller.CreatePass)
UserRouter.delete('/:id', useAuth, controller.DeleteUser)
UserRouter.get('/:id', useAuth, controller.UserDetails)