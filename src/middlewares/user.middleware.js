import jwt from "jsonwebtoken";
import 'dotenv/config';
import { User } from "../models/user.model.js";
import { Config } from "../config.js";

export const useAuth = async (req, res, next) => {


    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer")) {
        return res.status(401).json({
            message: "Token tapilmadi"
        })
    }

    const access_token = req.headers.authorization.split(" ")[1];
    if (!access_token) return res.status(401).json({
        message: "Token tapilmadi"
    })

    try {
        const jwtResult = jwt.verify(access_token, Config.JWT_secret)

        const user = await User.findById(jwtResult.sub).select("_id email verifyCode isVerifiedEmail verifyExpiredIn")
        if (!user) return res.status(401).json({ message: "User not found!" });

        req.user = user;

        next();

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            error,
        })
    }
}