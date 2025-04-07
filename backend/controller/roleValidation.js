export const updateUserRole = handleAsyncError(async (req, res, next) => {
    const { role } = req.body;

    const allowedRoles = ["admin", "user", "editor"];

    if (!role || !allowedRoles.includes(role)) {
        return next(new HandleError(`Invalid role: ${role}. Allowed roles: ${allowedRoles.join(", ")}`, 400));
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

//update user schema with role validation
// role: {
//     type: String,
//     enum: ["admin", "user", "editor"],
//     default: "user"
// }
