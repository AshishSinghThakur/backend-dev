import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from '../utils/ApiError.js'
import {User} from '../models/user.model.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const registeruser=asyncHandler(async (req,res)=>{
    //get user details from frontend
    //validation-not empty
    //check if user already exists - username, email
    //check for images, check for avatar
    //upload them to cloudinay, avatar
    //create user object - create entry in db
    //remove password and refresh token fields from response
    //check for user creation
    //return response   
    // res.status(200).json({
    //     message:"chai aur code"
    // })

    const {email, username, password, fullname}=req.body
    // if(fullname === "")
    // throw new ApiError(400,"Full Name is required")

    if(
        [fullname,email,username,password].some((field)=>
        field?.trim()==="")
    ){
        throw new ApiError(400,field + " is required")
    }

    const existingUser=await User.findOne({
        $or:[{ username },{ email }]
    })

    if(existingUser){
        throw new ApiError(409,
             "User with email or username already exists")
    }
    const avatarLocalPath=req.files?.avatar[0]?.path
    const coverImageLocalPath=req.files?.coverImage[0]?.path

    if(!avatarLocalPath){
        console.log("avatar not found")
        throw new ApiError(400,"Avatar file is required")
    }
   
    console.log("reached")
    const avatar= await uploadOnCloudinary(avatarLocalPath)
    const coverImage= await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400,"Avatar file is required")
    }

    const user= await User.create({
        fullname,
        avatar:avatar.url,
        coverImage:coverImage?.url || " ",
        email,
        password,
        username:username.toLowerCase()
    })

    const createdUser=await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500,"Something went wrong while creating user")
    }
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User created successfully")
    )
})

export {registeruser}