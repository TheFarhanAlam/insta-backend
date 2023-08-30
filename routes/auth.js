import express from "express";
import User from "../models/User.js";
import "dotenv/config"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Authenticate } from "../middleware/Authenticate.js";

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const {name, email, password, url} = req.body;
        if (!name || !email || !password) {
            return res.status(422).json({
                error: "Please fill all credentials"
            })
        };
        const user = await User.findOne({email: email});
        if (user) {
            return res.status(404).json({error: "User already exists"})
        };
        const newPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name: name,
            email: email,
            password: newPassword,
            profilePic: url
        });
        await newUser.save();
        res.status(201).json({newUser});
    } catch (error) {
        console.log(error);
    }
});
router.post("/login", async (req, res) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) {
            return res.status(422).json({
                error: "Please fill all credentials"
            });
        };
        const user = await User.findOne({email: email});
        if (!user) {
            return res.status(404).json({error: "Please register first"})
        };
        const matchPassword = await bcrypt.compare(password, user.password);
        const token = await jwt.sign({_id: user._id}, process.env.SECRET);
        if (!matchPassword) {
            return res.status(404).json({error: "Please fill right credentials"})
        };
        if (matchPassword) {
            res.status(200).json({user, token})
        };
    } catch (error) {
        console.log(error);
    }
});
router.get("/protected",Authenticate ,(req, res) => {
    res.json({name: "Hello"})
});

export default router;