import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type: String, required: true },
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true },
    phone: {type: String, default: ''},
    profileImage: {type: String, default: ''},
    cartItems: {type: Object, default: {} },
    resetPasswordToken: {type: String},
    resetPasswordExpire: {type: Date},
}, {minimize: false})

const User = mongoose.models.user || mongoose.model('user', userSchema)

export default User