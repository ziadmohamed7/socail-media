import { validationResult } from "express-validator";
import asyncHandler from "express-async-handler"

 const validationMiddleware = asyncHandler((req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({error : errors.array()});
    }
    next()
});

export default validationMiddleware;