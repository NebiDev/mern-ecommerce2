import User from "../models/userModel.js";
import handleAsyncError from "../middleware/handleAsyncError.js";
import HandleError from "../utils/handleError.js";
import { sendToken } from "../jwtToken.js";



// register user => /api/v1/register
// POST
export const registerUser = handleAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body;
    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: "sample id",
            url: "sample url",
        },
    });
    sendToken(user, res, `Welcome ${user.name}`, 201);    
})

// login user => /api/v1/login
// POST

export const loginUser = handleAsyncError(async (req, res, next) => {
    const { email, password } = req.body;
    // check if email and password are entered by user
    if (!email || !password) {
        return next(new HandleError("Please enter email and password", 400));
    }
    // finding user in database
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new HandleError("Invalid email or password", 401));
    }
    // check if password is correct or not
    const isPasswordMatched = await user.comparePassword(String(password));
    if (!isPasswordMatched) {
        return next(new HandleError("Invalid email or password", 401));
    }
    sendToken(user, res, `Welcome back ${user.name}`, 200); 
})


// logout user => /api/v1/logout
// POST
export const logout = handleAsyncError(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
    });
    res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
})