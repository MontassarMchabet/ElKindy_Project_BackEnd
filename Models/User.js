const mongoose = require("mongoose");

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
        }]
    }
)

const User = mongoose.model('User', userSchema);
module.exports = User;