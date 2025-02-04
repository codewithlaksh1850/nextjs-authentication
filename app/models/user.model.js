import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const UserSchema = new Schema({
    name: {
        type: String
    },
    username: {
        type: String,
        trim: true,
        required: [true, 'Username is required!'],
        unique: [true, 'Username must be unique!'],
        match: [/^(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z0-9]+$/, 'Username must have alphanumeric characters!']
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'Email is required!'],
        unique: [true, 'Email must be unique!'],
        match: [/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g, 'Invalid email!']
    },
    phone: {
        type: String
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    }
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return;

    this.password = await bcrypt.hash(this.password, 12);

    next();
});

UserSchema.methods.isPasswordCorrect = async function(password) {
    const result = await bcrypt.compare(password, this.password);
    return result;
}

UserSchema.methods.generateAccessToken = function () {
    const payload = {
        _id: this._id,
        email: this.email
    };

    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    })
}

UserSchema.methods.generateRefreshToken = function () {
    const payload = {
        _id: this._id
    };

    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    })
}

mongoose.models = {};
const User = mongoose.model('users', UserSchema);

export default User;
