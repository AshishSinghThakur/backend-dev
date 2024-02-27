import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose';
import {connectDB} from './db/index.js'
import {app} from './app.js'

dotenv.config({
    path:'./env'
})
connectDB().then(
    app.on('error',(error)=>{
        console.log("Error in connection",error)
        throw err
    }),
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server is connected at port: ${process.env.PORT}`)
    })
    ).catch(
    (err)=>{
        console.log("MONGODB connect Failed!!!",error)
    }
)
/*
import express from 'express'
const app=express()
;(async()=>{
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on('errror',(error)=>{
            console.log('ERROR',error)
            throw err
        })
        app.listen(process.env.PORT,()=>{
            console.log(`App is listening on port ${process.env.PORT}`)
        })
    }
    catch(error){
        console.error("Error: ",error)
        throw err
    }
})()
*/