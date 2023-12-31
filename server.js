import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import cors from "cors";
import User from "./routes/auth.js";
import Post from "./routes/post.js";
import UserProfile from "./routes/user.js";

const app = express();
const PORT = process.env.PORT || 8000;

const DB = "mongodb+srv://thefarhandeveloper:farhanalam77@insta-clone.cdcwgr4.mongodb.net/?retryWrites=true&w=majority";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use("/", User);
app.use("/post", Post);
app.use("/user", UserProfile);

mongoose.connect(DB)
.then(() => {
    console.log("Database Connected");
})
.catch((error) => {
    console.log(error);
});

app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
});