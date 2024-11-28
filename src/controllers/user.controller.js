import express from 'express'
import Joi from 'joi';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { User } from '../models/user.model.js';

const signin = async (req, res, next) => {
    const validData = await Joi.object({
        name: Joi.string().trim().min(3).max(50).required(),
        surname: Joi.string().trim().min(3).max(50).required(),
        age: Joi.number().integer().min(18).max(99).required(),
        email: Joi.string().trim().email().required(),
        password: Joi.string().trim().min(6).max(16).required(),
        repeat_password: Joi.ref("password")
    }).validateAsync(req.body, { abortEarly: false })
        .catch(err => {
            console.log("err:", err);
            return res.status(422).json({
                message: "Xeta bash verdi!",
                error: err.details.map(item => item.message)
            })
        })

    if (await User.findOne({email: validData.email})) {
        return res.json({
            message: `${validData.email} artıq sistemde movcuddur!`})
    }

    validData.password = await bcrypt.hash(validData.password, 10)

    const newUser = await User.create(validData)
    res.status(201).json(`${newUser.name} add to database`)
}

const login = async (req, res, next) => {
    const validData = await Joi.object({
        email: Joi.string().trim().email().required(),
        password: Joi.string().trim().min(6).max(16).required(),
    }).validateAsync(req.body, { abortEarly: false })
        .catch(err => {
            return res.status(422).json({
                message: "Xeta bash verdi!",
                error: err.details.map(item => item.message)
            })
        })

    const user = await User.findOne({
        email: validData.email,
    })
    if (!user) {
        return res.status(401).json({
            message: "Yeniden cehd edin"
        })
    }

    const ValidPassword = await bcrypt.compare(validData.password, user.password)
    if (!ValidPassword) {
        return res.status(401).json({
            message: "Yeniden cehd edin"
        })
    }

    const jwt_payload = {
        sub: user._id
    }

    const new_token = jwt.sign(jwt_payload, process.env.JWTsecret)

    res.json({
        message: `${new_token}--- vasitəsilə sistemə giriş edə bilərsiz`
    })
}

export const UserController =()=>({login,signin})