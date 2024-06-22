// Centralized error-handling middleware
const generalMiddleware = (err, req, res, next) =>{
    console.error(err.stack)
    if(err instanceof customError){
        return res.status(err.status).json({error: err.message})
    }
    return res.status(500).json({error:"Internal server error !"})

}

class customError extends Error{
    constructor(message,status=500){
        super(message);
        this.status = status;
        Error.captureStackTrace(this,this.constructor)
    }
}

export { generalMiddleware ,customError};