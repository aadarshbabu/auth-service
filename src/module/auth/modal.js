import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    user_id: {
        type: String, 
        required: true
    }, 
    user_name: {
        type: String, 
        require: true,
    },
    user_email: {
        type: String, 
        require: true, 
    }, 
    phone_number: {
        type: Number
    }, 
    password: {
        type: String, 
        required: true,
    }, 
    first_name: {
        type: String, 
        required: true
    }, 
    last_name: {
        type: String, 
        required: true
    }, 
    is_verified: {
        type: Boolean, 
        required: true,
        default: false,
    }, 
    is_blocked: {
        type: Boolean, 
        required: true,
        default: false
    }, 
    is_deleted: {
        type: Boolean,
        required: true,
        default: false,
    }




})


export const userModal = mongoose.model('User',userSchema)