import { Comment } from "../models/commentsModel.js";
import { Post } from "../models/postsModel.js";
import { User } from "../models/usersModel.js";
import { customError } from "../middlewares/error.js";

export const createComment = async (req, res, next) => {
  const { text, userId, postId } = req.body;
  if (!text || !userId || !postId) {
    throw new customError("test , userId , postId fields are required ", 404);
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new customError("user not found", 404);
    }

    const post = await Post.findById(postId);
    if (!post) {
      throw new customError("post not found", 404);
    }

    const comment = await Comment.create({
      text,
      userId,
      postId,
    });

    res.status(201).json({ message: "comment created successfully ", comment });
  } catch (error) {
    next(error);
  }
};

export const createCommentReplay = async (req, res, next) => {
    const {text,userId} = req.body;
    const {commentId} = req.params;
    try {
        const parentComment  = await Comment.findById(commentId);
        if(!parentComment){
            throw new customError("parent Comment not found !",404);
        }
        const user = await User.findById(userId);
        if(!user){
            throw new customError("post not found",404);
        }
        parentComment.replies.push({userId,text});
        await parentComment.save();

        res.status(201).json({parentComment});
        
    } catch (error) {
        next(error)
    }
};

export const updateComment  = async (req,res,next) => {
    const {commentId} = req.params;
    try {
        const comment = await Comment.findById(commentId);
        if(!comment){
            throw new customError("comment not found !",404);
        }

        const updatedComment = await Comment.findByIdAndUpdate(commentId,req.body,{new:true});

        res.status(200).json({updatedComment});

    } catch (error) {
        next(error)
    }
};


export const updateCommentReplay = async (req,res,next) => {
    const {commentId,replayId} = req.params;
    const {text,userId} = req.body;

    try {
        const comment = await Comment.findById(commentId);
        if(!comment){
            throw new customError("comment not found ",404);
        }

        const replayIndex = await comment.replies.findIndex(replay=>replay._id.toString() == replayId)

        if (replayIndex == -1){
            throw new customError("replay not found ",404);
        }

        if(comment.replies[replayIndex].userId.toString() !==userId){
            throw new customError("you can update your comment only ",400);
        }

        comment.replies[replayIndex].text = text

        await comment.save();

        res.status(200).json(comment);

    } catch (error) {
        next(error);
    }
}

const populateUserDetails = async (comments) => {
  for (const comment of comments) {
    await comment.populate("userId", "username fullName profilePicture");
    if (comment.replies.length > 0) {
      await comment.populate(
        "replies.userId",
        "username fullName profilePicture"
      );
    }
  }
};

export const getAllCommentsOfPost = async (req,res,next) => {
    const {postId} = req.params;

    let comments;
    try {
        const post = await Post.findById(postId);
        if(!post){
            throw new customError("post not found!",404);
        }

         comments = await Comment.find({postId});

          await populateUserDetails(comments);

         res.status(200).json(comments);


    } catch (error) {
        next(error)
    }

};

export const deleteComment = async (req,res,next) => {
    const {commentId} = req.params;

    try {
        const comment = await Comment.findById(commentId);

        if(!comment){
            throw new customError("comment not found !",404);
        }

        const deletedComment = await Comment.findByIdAndDelete(commentId);

        res.status(200).json({message : 'comment deleted successfully', deletedComment});

    } catch (error) {
        next(error)
    }
};

export const deleteReplayOfComment = async (req,res,next) => {
    const {commentId,replayId} = req.params;

    try {
        const comment = await Comment.findById(commentId);
        if(!comment){
            throw new customError("comment not found !",404);
        }

        comment.replies = comment.replies.filter(replay=>replay._id.toString() !== replayId);

       await comment.save();

       res.status(200).json({message:"comment replay deleted successfully"});
    } catch (error) {
        next(error)
    }
};

export const likeComment = async (req,res,next) => {
    const {commentId} = req.params;
    const {userId} = req.body

    try {
      const comment = await Comment.findById(commentId);
      if (!comment) {
        throw new customError("comment not found!", 404);
      }

      if (comment.likes.includes(userId)) {
        throw new customError("you already like this comment ", 404);
      }

        comment.likes.push(userId);
       await comment.save();

       res.status(200).json({message:"like added ."});

    } catch (error) {
        next(error);
    }
};

export const dislikeComment = async (req,res,next) => {
    const {commentId} = req.params;
    const { userId } = req.body;

    try {
        const comment = await Comment.findById(commentId);
        if(!comment){
            throw new customError("comment not found!",404);
        }

        if (!comment.likes.includes(userId)) {
          throw new customError("you already dislike this comment ", 404);
        }

        comment.likes = comment.likes.filter(user=>user.toString() !== userId);

       await comment.save()

       res.status(200).json({message:"you dislike comment successfully "});

    } catch (error) {
        next(error)
    }
};

export const likeCommentReplay = async (req,res,next) => {
    const {commentId,replayId} = req.params;
    const { userId } = req.body;

    try {
        const comment = await Comment.findById(commentId);
        if(!comment){
            throw new customError("comment not found !",404);
        }

        const replay = comment.replies.id(replayId);
        if(!replay){
            throw new customError("replay not found!",404);
        }

        if(replay.likes.includes(userId)){
            throw new customError("you already like this replay",404);
        }
        console.log(replay.likes);

        replay.likes.push(userId);
        await comment.save();

        res.status(200).json({message:"replay comment likes successfully "});

    } catch (error) {
        next(error);
    }
};

export const dislikeCommentReplay = async (req,res,next) => {
    const {commentId , replayId} = req.params;
    const {userId} = req.body;

    try {
        const comment = await Comment.findById(commentId);
        if(!comment){
            throw new customError("comment not found !",404);
        }

        const replay = comment.replies.id(replayId);
        if(!replay){
            throw new customError("replay not found!",404);
        }

        if(!replay.likes.includes(userId)){

            throw new customError("you already dislike this replay",400);
        }


        replay.likes = replay.likes.filter(user=>user.toString() !==userId);
        await comment.save();

        res.status(200).json({message:"you dislike comment replay successfully "});


    } catch (error) {
        next(error)
    }
}