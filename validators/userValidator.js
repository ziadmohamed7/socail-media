import  validationMiddleware  from "../middlewares/validationMiddleware.js";
import { check } from "express-validator";

export const getUserValidator = [
  //1)rules
  check("userId").isMongoId().withMessage("user id is not valid "),
  //2)validation middleware
  validationMiddleware,
];

export const updateUserValidator = [
  check("userId").isMongoId().withMessage("user id is not valid "),
  check("email").optional().isEmail().withMessage("Invalid email formate"),
  check("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Too short password "),
  check("fullName").optional(),
  validationMiddleware,
];
