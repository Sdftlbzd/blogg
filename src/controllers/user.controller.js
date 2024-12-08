import express from "express";
import Joi from "joi";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import "dotenv/config";
import moment from 'moment';
import * as http from 'http';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { User } from "../models/user.model.js";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.Email,
    pass: process.env.EmailPassword,
  },
});

const signin = async (req, res, next) => {
  const validData = await Joi.object({
    name: Joi.string().trim().min(3).max(50).required(),
    surname: Joi.string().trim().min(3).max(50).required(),
    age: Joi.number().integer().min(18).max(99).required(),
    email: Joi.string().trim().email().required(),
    password: Joi.string().trim().min(6).max(16).required(),
    repeat_password: Joi.ref("password"),
  })
    .validateAsync(req.body, { abortEarly: false })
    .catch((err) => {
      console.log("err:", err);
      return res.status(422).json({
        message: "Xeta bash verdi!",
        error: err.details.map((item) => item.message),
      });
    });

  if (await User.findOne({ email: validData.email })) {
    return res.json({
      message: `${validData.email} artıq sistemde movcuddur!`,
    });
  }

  validData.password = await bcrypt.hash(validData.password, 10);

  const newUser = await User.create(validData);
  res.status(201).json(`${newUser.name} add to database`);
};

const login = async (req, res, next) => {
  const validData = await Joi.object({
    email: Joi.string().trim().email().required(),
    password: Joi.string().trim().min(6).max(16).required(),
  })
    .validateAsync(req.body, { abortEarly: false })
    .catch((err) => {
      return res.status(422).json({
        message: "Xeta bash verdi!",
        error: err.details.map((item) => item.message),
      });
    });

  const user = await User.findOne({
    email: validData.email,
  });
  if (!user) {
    return res.status(401).json({
      message: "Yeniden cehd edin",
    });
  }

  const ValidPassword = await bcrypt.compare(validData.password, user.password);
  if (!ValidPassword) {
    return res.status(401).json({
      message: "Yeniden cehd edin",
    });
  }

  const jwt_payload = {
    sub: user._id,
  };

  const new_token = jwt.sign(jwt_payload, process.env.JWTsecret, {
    algorithm: "HS256",
    expiresIn: "1d",
  });

  res.json({
    message: `${new_token}--- vasitəsilə sistemə giriş edə bilərsiz`,
  });
};

const verifyEmail = async (req, res, next) => {
    
  const { email } = req.body;
  if (req.user.isVerifiedEmail===true) return res.json({ message: "Email is already verified" })

  const verifyCode = Math.floor(Math.random() * 600000);

  const verifyExpiredIn = moment().add(5, "minutes")

  req.user.verifyCode = verifyCode;
  req.user.verifyExpiredIn = verifyExpiredIn;

  await req.user.save();

  const mailOptions = {
    from: process.env.Email,
    to: email,
    subject: "Hello",
    text: `Please Verify your Email address ${verifyCode}`,
  };


  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email: ", error);
      return res.status(500).json({
        message: error.message,
        error,
      });
    } else {
      console.log("Email sent: ", info);
      return res.json({ message: "Check your email" });
    }
  });
};

const checkVerifyCode = async(req, res) => {

    try {
        const validData = await Joi.object({
            code: Joi.number()
                .min(100000)
                .max(999999)
                .required()
            // .messages({
            //     "object.regex": "Must have at least 8 characters",
            // }),
        }).validateAsync(req.body, { abortEarly: false })
  const user = req.user;

   if (!user.verifyCode) {
            return res.status(400).json({
                message: "Verification code not found!"
            })
        }

 if (user.verifyExpiredIn < Date.now()) {
    return res.status(400).json("artıq vaxt bitib, yenidən cəhd edin");}

  if (user.verifyCode !== validData.code) {
    return res.status(400).json("kod eyni deyil");
  }
  req.user.isVerifiedEmail= true;
  req.user.verifyCode = null
  req.user.verifyExpiredIn = null
  await req.user.save();
  return res.json({
    message: "Email verified successfully!"})

} catch (error) {
    console.error("Error: ", error);
    res.status(500).json({
        message: error.message,
        error,
    })
}
};

const ForgetPass = async(req, res, next)=>{
    const user = await User.findOne({
        email: req.body.email,
});
     // res.json(user._id)
      if (!user) {
        return res.status(401).json({
          message: "Belə bir istifadəçi yoxdur",
        });
      }
    //   console.log(users)
    const token = uuidv4()
    user.uuidToken = token
     await user.save()
     console.log(token)
    // res.send(data)
      return res.json(token)

}

const CreatePass = async(req, res, next)=>{
    const validData = await Joi.object({
        newPassword: Joi.string().trim().min(6).max(16).required(),
      })
        .validateAsync(req.body, { abortEarly: false })
        .catch((err) => {
          console.log("err:", err);
          return res.status(422).json({
            message: "Xeta bash verdi!",
            error: err.details.map((item) => item.message),
          });
        });

    const user = await User.findOne({
        uuidToken: req.params.uuidToken,
      });

      if(!user) {
        return res.status(401).json({
          message: "Belə bir istifadəçi yoxdur",
        });
      }
    if(user.password===validData.newPassword) return res.json("Əvvəlki parolu yaza bilməzsiniz")
user.password = validData.newPassword
await user.save()
res.send(`${user.email} mailinin password-ü yeniləndi`)
}
export const UserController = () => ({
  login,
  signin,
  verifyEmail,
  checkVerifyCode,
  ForgetPass,
  CreatePass
});
