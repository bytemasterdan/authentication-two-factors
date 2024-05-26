import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: [true, 'Name is required']
    },
    password:{
        type:String,
        required: [true, 'Password is required']
    },
    email:{
        type:String,
        required: [true, 'Email is required'],
        unique : true 
    },
    emailValidated:{
        type:Boolean,
        default: false
    },
    img:{
        type: String
    },
    role:{
        type: [String],
        enum: ['ADMIN', 'USER'],
        default: ['USER']
    }
})

export const UserModel = mongoose.model('User', userSchema)