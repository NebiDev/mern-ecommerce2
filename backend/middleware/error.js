import HandleError from "../utils/handleError.js";


export default (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

     // Handle Mongoose CastError (invalid ObjectId)
     if (err.name === "CastError") {
        err.message = `Resource not found. Invalid: ${err.path}`;
        err.statusCode = 404;        
    }

    // Handle Mongoose Duplicate Key Error
    if (err.code === 11000) {
        const message = `This ${Object.keys(err.keyValue)} is already registered.Please login to continue`;
        err = new HandleError(message, 400);
    }


    res.status(err.statusCode).json({
        success: false,
        error: err.message 
    });
}