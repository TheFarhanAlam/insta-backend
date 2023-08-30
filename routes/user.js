import express from "express";
import Post from "../models/Post.js";
import {Authenticate} from "../middleware/Authenticate.js";
const router = express.Router();
import User from "../models/User.js";

router.get("/:id", Authenticate, async (req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findOne({_id: id}).select("-password");
        const allInfo = await Post.find({postedBy: id}).populate("postedBy", "_id name");
        res.status(200).json({user, allInfo});
    } catch (error) {
        console.log(error);
    }
});
router.put("/follow", Authenticate, (req, res) => {
    try {
        // console.log(req.body.followId);
        User.findByIdAndUpdate(req.body.followId,{
            $push:{follower:req.user._id}
        },{
            new:true
        }).then((result)=>{
            // console.log(result);
          User.findByIdAndUpdate(req.user._id,{
              $push:{following:req.body.followId}
          },{new:true}).select("-password").then(result=>{
              res.json(result)
          }).catch(err=>{
              return res.status(422).json({error:err})
          })
    
        })
    } catch (error) {
        console.log(error);
    }
});
router.put("/unfollow", Authenticate, (req, res) => {
    try {
        User.findByIdAndUpdate(req.body.followId,{
            $pull:{followers:req.user._id}
        },{
            new:true
        }).then((result)=>{
          User.findByIdAndUpdate(req.user._id,{
              $pull:{following:req.body.followId}
              
          },{new:true}).select("-password").then(result=>{
              res.json(result)
          }).catch(err=>{
              return res.status(422).json({error:err})
          })
    
        })
    } catch (error) {
        console.log(error);
    }
});

 


export default router