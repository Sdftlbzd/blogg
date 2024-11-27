import express from 'express'
import { Router } from 'express'
import { UserRouter } from './user.route.js'
import { BlogRouter } from './blog.route.js'
export const Mainrouter = Router()

Mainrouter.use('/users', UserRouter)
Mainrouter.use('/blogs', BlogRouter)