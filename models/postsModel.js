import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      reference: "User",
      required: [true, "user id is required "],
    },

    caption: {
      type: String,
      max_length: [500, "post description is much "],
      trim:true
    },

    img: [
      {
        type: String,
        required: false,
      },
    ],

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

const Post= mongoose.model("Post", postSchema);
export {Post}
