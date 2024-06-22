import { Post } from "../models/postsModel.js";
import { User } from "../models/usersModel.js";
import { customError } from "../middlewares/error.js";

export const createPost = async (req, res, next) => {
  const { userId, caption } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new customError("user not found ", 400);
    }
    const post = await Post.create({ userId, caption });

    user.posts.push(post._id);
    await user.save();

    res.status(201).json({ post });
  } catch (error) {
    next(error);
  }
};

export const getTimeLinePosts = async (req, res, next) => {
  const userId = req.user._id;

  try {
    const followingIds = req.user.following;
    // Fetch posts from users in the 'following' list, and the user's own posts
    const posts = await Post.find({
      userId: { $in: [...followingIds, userId] },
    }).sort({ createdAt: -1 });

    res.status(200).json({ Result: posts.length, data: posts });
  } catch (error) {
    next(error);
  }
};

export const getUserPosts = async (req, res, next) => {
  try {
    const postsIds = req.user.posts;
    const posts = await Post.find({ _id: { $in: postsIds } });
    res.status(200).json({ posts });
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      throw new customError("Post not found  ", 400);
    }

    const update = await Post.findByIdAndUpdate(postId, req.body, {
      new: true,
    });

    res
      .status(200)
      .json({ message: "user updated successfully ", data: update });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      throw new customError("post not found ", 400);
    }
    const user = await User.findById(post.userId);
    user.posts = user.posts.filter((post) => post.toString() !== postId);
    const deletedPost = await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: "post deleted successfully", deletedPost });
  } catch (error) {
    next(error);
  }
};


export const likePost = async (req,res,next) => {
  const {postId} = req.params;
  const {_id} = req.user

  try {
    const post = await Post.findById(postId);
    if(!post){
      throw new customError("post not found ",400);
    }
    if(post.likes.includes(_id)){
      throw new customError("you already like this post ",400)
    }

    post.likes.push(_id);
    await post.save();

    res.status(200).json({message:"you like this post successfully"})

  } catch (error) {
    next(error)
  }
};

export const dislikePost = async (req,res,next) => {
  const {postId} = req.params;
  const {_id} = req.user;


  try {
    const post = await Post.findById(postId);
    if(!post){
      throw new customError("post not found",400);
    }

    if(!post.likes.includes(_id)){
      throw new customError("you not like this post yet .. ",400);
    }

    post.likes = post.likes.filter(id=>!id.equals(_id))

    await post.save();

    res.status(200).json({message:"you dislike this post "});

  } catch (error) {
    next(error)
  }
};