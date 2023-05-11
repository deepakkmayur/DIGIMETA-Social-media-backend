const errorHndler=(err,req,res,next)=>{
   //validation error check
   if (err.name === "validationError") {
      const message = Object.values(error.errors).map(value => value.message);
      return res.status(400).json({
         error: message
      })
   }else{
      //all error check
   const statusCode=res.statusCode?res.statusCode:500
   res.status(statusCode)
   res.json({
     error:err.message,
     stack:err.stack
   })
}
}


export default errorHndler