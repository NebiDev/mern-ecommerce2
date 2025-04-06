export const sendToken = (user, res, message, statusCode) => {
    const token = user.getJWTToken();

    // options for cookies
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };
    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        message,
        user,
        token,
    });
}