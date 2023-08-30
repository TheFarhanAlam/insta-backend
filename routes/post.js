import express from "express";
import Post from "../models/Post.js";
import {Authenticate} from "../middleware/Authenticate.js";
const router = express.Router();

router.get("/allpost", Authenticate, async (req, res) => {
    try {
        const post = await Post.find({}).populate("postedBy comments.postedBy", "_id name profilePic").sort("createdAt");
        res.status(200).json({post});
    } catch (error) {
        console.log(error);
    }
});
router.get("/mypost", Authenticate, async (req, res) => {
    try {
        const myPost = await Post.find({postedBy: req.user._id}).populate("postedBy", "_id name");
        res.status(200).json({
            myPost
        });
    } catch (error) {
        console.log(error);
    }
});
router.post("/createpost",Authenticate ,async (req, res) => {
    console.log(req.body);
    const {title, body, url} = req.body;
    if (!title || !body || !url) {
      return res.status(422).json({error: "Please fill all the feilds"});
    };
    req.user.password = undefined;
    const newPost = new Post({
        title: title,
        body: body,
        photo: url,
        postedBy: req.user
    });
    await newPost.save();
    res.status(201).json({newPost});
});
router.put("/like", Authenticate, async (req, res) => {
    try {
        const like = await Post.findByIdAndUpdate({_id: req.body.postId}, {
            $push: {likes: req.user._id}
        }, {
            new: true
        });
        res.status(200).json({like});
    } catch (error) {
        console.log(error);
    }
});
router.put("/unlike", Authenticate, async (req, res) => {
    try {
        const like = await Post.findByIdAndUpdate({_id: req.body.postId}, {
            $pull: {likes: req.user._id}
        }, {
            new: true
        });
        res.status(200).json({like});
    } catch (error) {
        console.log(error);
    }
});
router.put("/comment", Authenticate, async (req, res) => {
    try {
        const comment = {
            text: req.body.text,
            postedBy: req.user._id
        };
        const comments = await Post.findByIdAndUpdate({_id: req.body.postId}, {
            $push: {comments: comment}
        }, {
            new: true
        }).populate("comments.postedBy", "_id name");
        console.log(comments);
        res.status(200).json({comments});
    } catch (error) {
        console.log(error);
    }
});
router.delete("/delete/:_id", Authenticate, async (req, res) => {
    try {
        const deletedPost = await Post.findByIdAndDelete({_id: req.params._id});
        res.json(deletedPost);
    } catch (error) {
        console.log(error);
    }
});
router.get("/getsubpost", Authenticate, async (req, res) => {
    try {
        const post = await Post.find({postedBy: {$in: req.user.following}}).populate("postedBy comments.postedBy", "_id name")
        res.status(200).json({post});
    } catch (error) {
        console.log(error);
    }
});

export default router;