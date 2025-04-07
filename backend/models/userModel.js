import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';


const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
        trim: true,
        maxLength: [30, 'Name cannot exceed 30 characters'],
        minLength: [3, 'Name should have more than 3 characters'],   
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
        validate: [validator.isEmail, 'Please enter a valid email address'],
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minLength: [8, 'Password should be greater than 8 characters'],
        select: false,
    },
    avatar: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    role: {
        type: String,
        enum: ["admin", "user", "editor"],
        default: 'user',
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,    
},
{
    timestamps: true,
});

// Hashing password before saving to database
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

// JWT token generation
userSchema.methods.getJWTToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME,
    });
};
// Compare password
userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generating password reset token
userSchema.methods.generatePasswordResetToken = function() {
    // Generating token
    const resetToken = crypto.randomBytes(20).toString('hex');
    // Hashing and adding resetPasswordToken to userSchema
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes
    return resetToken;
};


export default mongoose.model('User', userSchema);