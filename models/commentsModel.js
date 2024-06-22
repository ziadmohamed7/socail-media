
import mongoose from "mongoose";

const commentSchema = mongoose.Schema({
  text: {
    type: String,
    max_length: [500, "comment description is much"],
    required: [true, "description filed is required "],
  },

  postId: {
    type: mongoose.Schema.ObjectId,
    ref: "post",
    required: [true, "post id  is required for comments "],
  },

  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "post id  is required for comments  "],
  },

  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  replies: [
    {
      text: {
        type: String,
        max_length: [500, "comment description is much"],
        required: [true, "description filed is required "],
      },

      userId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "post id  is required for comments  "],
      },

      likes: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],

  createdAt: {
    type: Date,
    default: Date.now,
  },

});

const Comment = mongoose.model("Comment", commentSchema);
export { Comment };