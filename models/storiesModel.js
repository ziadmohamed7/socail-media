import mongoose from "mongoose";

const storySchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "user id is required "],
  },
  
  img: {
    type: String,
    required: [true, "image is required "],
  },

  text:{
    type:String,
    trim:true,
  },

  createdAt:{
    type:Date,
    default:Date.now
  }

});

const Story = mongoose.model("Story", storySchema);
export {Story}