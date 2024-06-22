import { check } from "express-validator";
import  validationMiddleware  from "../middlewares/validationMiddleware.js";

export const createPostValidation = [
  check("userId")
    .notEmpty()
    .withMessage("user filed is required ")
    .isMongoId()
    .withMessage("invalid user formate "),
  check("caption")
    .optional()
    .isLength({ max: 500 })
    .withMessage("too long caption length "),
  validationMiddleware,
];