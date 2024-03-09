const mongoose = require("mongoose");

const crypto = require('crypto');


const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        lastname: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        username: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        dateOfBirth: {
            type: Date,
        },
        profilePicture: {
            type: String
        },
        isEmailVerified: {
            type: Boolean
        },
        role: {
            type: String,
            enum: ['admin', 'prof', 'client'],
            default: 'client'
        },
        wishlist: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }],
        passwordResetToken: {
            type: String,
        },
        passwordResetExpire: {
            type: Date,

        }
    }
)


userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(60).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;