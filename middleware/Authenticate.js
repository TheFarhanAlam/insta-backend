import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const Authenticate = async (req, res, next) => {
    try {
        const {authorization} = req.headers;
        if (!authorization) {
            return res.status(401).json({error: "You must logged in"})
        };
        const verify = await jwt.verify(authorization, "heytherethisisaprivatekey");
        if (!verify) {
            return res.status(401).json({error: "You must logged in"});
        };
        const {_id} = verify;
        const user = await User.findById({_id: _id});
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
    }
};