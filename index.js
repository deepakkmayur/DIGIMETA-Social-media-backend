
import express from "express"
import bodyParser from "body-parser"
import mongoose from "mongoose"
import dotenv from 'dotenv'
import cors from 'cors'


import AuthRoute from "./Routes/AuthRoute.js"
import UserRoute from "./Routes/UserRoute.js"
import PostRoute from './Routes/PostRoute.js'   
import UploadRoute from './Routes/UploadRoute.js'
import errorHndler from './Middleware/errorMiddleware.js'



const app=express()    
dotenv.config()  

//to server images for public
app.use(express.static('public'))
app.use('/images',express.static('images'))


//Middleware

app.use(bodyParser.json({limit:'30mb',extended:true}))
app.use(bodyParser.urlencoded({limit:'30mb',extended:true}))
app.use(cors())



mongoose.connect(process.env.MONGO_DB,{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>{
   console.log("db connected succefully");
   app.listen(process.env.PORT,()=>{console.log(`server is running at port ${process.env.PORT}`);})                  
}).catch((error)=>{
   console.log("db connection error :",error)})
 


//all routes
app.use('/auth',AuthRoute)
app.use('/user',UserRoute)                      
app.use('/upload',UploadRoute )
//post and comment route
app.use('/post',PostRoute)



 
//error handling middleware
app.use(errorHndler)

