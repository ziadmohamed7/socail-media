import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js";
import postRoute from "./routes/postRoute.js";
import storyRoute from "./routes/storyRoute.js";
import authRoute from "./routes/authRoute.js";
import commentRoute from "./routes/commentRoute.js";

import { generalMiddleware } from "./middlewares/error.js";
import { authMiddleware } from "./middlewares/authMiddleware.js";

dotenv.config();

const app = express();

// middlewares
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

const port = 3000;

// routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users",authMiddleware, userRoute);
app.use("/api/v1/posts",authMiddleware, postRoute);
app.use("/api/v1/stories",authMiddleware, storyRoute);
app.use("/api/v1/comments", authMiddleware,commentRoute);

// connect to db
mongoose
  .connect(process.env.DB_CONNECT_STRING)
  .then(() => {
    app.listen(port, () => {
      console.log(`Listen on port : ${port}`);
    });
    console.log(mongoose.connection.host);
    console.log("Database name : ", mongoose.connection.name);
  })
  .catch((err) => {
    console.log(err);
  });

// Centralized error-handling middleware
app.use(generalMiddleware);