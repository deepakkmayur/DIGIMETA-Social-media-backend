import  jwt from "jsonwebtoken";
import dotenv from "dotenv"
import asyncHandler from 'express-async-handler'

dotenv.config()
const secret=process.env.JWT_KEY

 const authMiddleware=asyncHandler(async(req,res,next)=>{
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
   try {
     const token=req.headers.authorization.split(" ")[1]
    //  console.log(token,"////////////"); 
     if(token){
      const decoded=jwt.verify(token,secret)
      // console.log(decoded,"//////////////");  
      req.body._id=decoded?.id
      // console.log(req.body._id,"------------req.body._id---------");
     }
     next()
   } catch (error) {
    console.log(error); 
    res.status(401)
   throw new Error("not auithorized") 
   }
 }else{
  res.status(401)
  throw new Error("not authorized,no token")
}

})

 export default authMiddleware
