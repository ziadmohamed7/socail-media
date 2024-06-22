import { Story } from "../models/storiesModel.js";
import { User } from "../models/usersModel.js";
import { customError } from "../middlewares/error.js";


export const createStory = async (req, res, next) => {

    const { userId } = req.params;
    const { text} = req.body

  if (!userId || !text) {
    return next(new CustomError("User ID and text are required", 400));
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new customError("user not found", 400);
    }

    let imgUrl = ""
    if(req.file){
         imgUrl =`${process.env.URL}${Date.now()}/uploads/${req.file.filename}`;
    }

    const story =await Story.create({
      text,
      img: imgUrl,
      userId,
    });

    res.status(201).json({story});

  } catch (error) {
    next(error);
  }
};


export const getTimeLineStories = async (req,res,next) => {
    const {_id} = req.user;
    try {
        const followingListOfIds = req.user.following;
        const stories = await Story.find({
            userId:{$in:[...followingListOfIds,_id]}
        })

        res.status(200).json({result:stories.length,stories})

    } catch (error) {
        next(error)
    }
};

export const getUserStories = async (req,res,next) => {
    const userId = req.user._id

    try {
        const userStories = await Story.find({userId})
        
        res.status(200).json({result:userStories.length,userStories})

    } catch (error) {
        next(error)
    }
};

export const deleteStory = async (req,res,next) => {
    const {storyId} = req.params;

    try {
        const story = await Story.findByIdAndDelete(storyId);
        res.status(200).json({message:"story deleted successfully ",story});

    } catch (error) {
        next(error)
    }
}

export const deleteUserStories = async (req,res,next) => {
     const userId=req.params.userId
    try{
        const user=await User.findById(userId)
        
        if(!user){
            throw new CustomError("No user found",404)
        }
     await Story.deleteMany({userId})
     res.status(200).json({message:"Stories has been deleted!"})
    
    } catch (error) {
        next(error)
    }
};