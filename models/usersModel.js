import mongoose from "mongoose";
import bcrypt from "bcrypt"

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "User name field is required "],
      trim: true,
      unique: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "email field is required "],
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      minlength: [6, "password should be more than 6 characters"],
      required: [true, "password filed is required "],
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    coverPicture: {
      type: String,
      default: "",
    },

    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    blackList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],

    city: String,
    website: String,
  },
  { timestamps: true }
);

// userSchema.pre("save", async function (next) {
//   // check if password is modified firstly or not
//   if (!this.isModified("password")) return next();
//   // make hash
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password") || user.isNew) {
    try {
      const hash = await bcrypt.hash(user.password, 10);
      user.password = hash;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

const User = mongoose.model("User", userSchema);
export { User };
