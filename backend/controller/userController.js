import User from "../models/userModel.js";
import handleAsyncError from "../middleware/handleAsyncError.js";
import HandleError from "../utils/handleError.js";
import { sendToken } from "../jwtToken.js";
import {sendEmail} from "../utils/sendEmail.js";
import crypto from "crypto";
import {v2 as cloudinary} from "cloudinary";




// register user => /api/v1/register
// POST
export const registerUser = handleAsyncError(async (req, res, next) => {
    const { name, email, password, avatar } = req.body;

    if (!name || !email || !password) {
        return next(new HandleError('Name, email, and password are required', 400));
    }

    let avatarData = {
        public_id: "default_avatar",
        url: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&length=1`,
      };
      

    if (avatar) {
        const myCloud = await cloudinary.uploader.upload(avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale",
        });

        avatarData = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        };
    }

    const user = await User.create({
        name,
        email,
        password,
        avatar: avatarData,
    });

    sendToken(user, res, `Welcome ${user.name}`, 201);    
});


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

// reset password => /api/v1/password/reset  Email
// POST
export const requestPasswordReset = handleAsyncError(async (req, res, next) => {
    const { email} = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return next(new HandleError("User not found", 404));
    }
    let resetToken;
    try {
        resetToken = user.generatePasswordResetToken();
        await user.save({ validateBeforeSave: false });


    } catch (error) {
        console.log(error);
        return next(new HandleError("Could not save reset TokenExpiredError, please try again later.",  500));       
    }
    const resetPasswordURL = `http://localhost/api/v1/reset/${resetToken}`;
    const message = `Use the following link to reset your password:\n\n ${resetPasswordURL}. \n\n This link will expire in 30 minutes. \n\n If you have not requested this email, then ignore it.`;
    try {
        await sendEmail({
            email: user.email,
            subject: "Password Reset Request",
            message,
        });
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new HandleError("Email could not be sent, please try again.", 500));        
    }
        
})

// reset password => /api/v1/password/reset/:token
// POST

export const resetPassword = handleAsyncError(async (req, res, next) => {
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        return next(new HandleError("Reset Password Token is invalid or has expired", 400));
    }

    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
        return next(new HandleError("Please provide both password and confirm password", 400));
    }

    if (password !== confirmPassword) {
        return next(new HandleError("Passwords do not match", 400));
    }

    if (password.length < 8) {
        return next(new HandleError("Password must be at least 8 characters long", 400));
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendToken(user, res, "Password updated successfully", 200);
});

// get user details => /api/v1/me
// POST
export const getUserDetails = handleAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    // console.log(req.user.id); // this is the id of the user who is logged in
    res.status(200).json({
        success: true,
        user,
    });
    
})

// update user password => /api/v1/password/update
// PUT
export const updatePassword = handleAsyncError(async (req, res, next) => {
    const {oldPassword, newPassword, confirmPassword } = req.body;
    const user = await User.findById(req.user.id).select("+password");
    // check if old password is correct or not
    const isPasswordMatched = await user.comparePassword(String(oldPassword));
    if (!isPasswordMatched) {
        return next(new HandleError("Old password is incorrect", 401));
    }
    // check if new password and confirm password are same or not
    if (newPassword !== confirmPassword) {
        return next(new HandleError("New password and confirm password do not match", 400));
    }
    // check if new password is same as old password or not
    if (oldPassword === newPassword) {
        return next(new HandleError("New password cannot be same as old password", 400));
    }
    // check if new password is less than 8 characters or not
    if (newPassword.length < 8) {
        return next(new HandleError("New password must be at least 8 characters long", 400));
    }
    // update password
    user.password = newPassword;
    await user.save();
    sendToken(user, res, "Password updated successfully", 200);
})

// update user profile => /api/v1/me/update
// PUT
export const updateProfile = handleAsyncError(async (req, res, next) => {
    const { name, email } = req.body;
    const updatedUserData = {
        name,
        email,
    };
    const user = await User.findByIdAndUpdate(req.user.id, updatedUserData, {
        new: true,
        runValidators: true,   
    });
    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user,
    });

})

// admin getting user info => /api/v1/admin/users
// GET
export const getUsersList = handleAsyncError(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        success: true,
        count: users.length,
        users,
    });

})

// admin getting single user info => /api/v1/admin/user/:id
// GET
export const getSingleUser = handleAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new HandleError(`User not found with id: ${req.params.id}`, 404));
    }
    res.status(200).json({
        success: true,
        user,
    });

})

// admin updating user role => /api/v1/admin/user/:id
// PUT
export const updateUserRole = handleAsyncError(async (req, res, next) => {
    const { role } = req.body;

    if (!role) {
        return next(new HandleError("Role is required", 400));
    }

    const updatedUserRole = { role };

    const user = await User.findByIdAndUpdate(req.params.id, updatedUserRole, {
        new: true,
        runValidators: true,
    });
    if (!user) {
        return next(new HandleError(`User not found with id: ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        message: "User role updated successfully",
        user,
    });
});

// admin deleting user => /api/v1/admin/user/:id
// DELETE
export const deleteUser = handleAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new HandleError(`User not found with id: ${req.params.id}`, 404));
    }
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success: true,
        message: "User deleted successfully",
    });
})
