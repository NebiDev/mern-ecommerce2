import handleAsyncError from "./handleAsyncError.js";
import jwt from 'jsonwebtoken';
import User from "../models/userModel.js";
import HandleError from "../utils/handleError.js";



// checking if the user is logged in or not to access the protected routes
export const verifyUserAuth =  handleAsyncError(async (req, res, next) => {
    const {token} = req.cookies;
    // console.log(token);
    
    if (!token) {
        return next(new HandleError("Authentication needed. Please login to access the resource", 401));
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedData.id);
    // console.log(decodedData);
    next();    // this will call the next middleware or route handler
})


// role based access control
export const roleBasedAccess = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new HandleError(`Role: ${req.user.role} is not allowed to access this resource`, 403));
        }
        next();
    }
}