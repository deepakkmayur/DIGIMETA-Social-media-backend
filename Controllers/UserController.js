import UserModel from "../Modals/userModal.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


//get all users
export const getAllUser= async (req,res)=>{
   try {
    let users=await UserModel.find() 
    users=users.map((user)=>{  
      const {password,...otherDetails}=user._doc
      return otherDetails
    }) 
    res.status(200).json(users)
   } catch (error) {
     console.log(error); 
     res.status(500).json(error)
   }
}


//get user from the database-----------------------------------------------------------------
 export const getUser= async (req,res)=>{
  const id=req.params.id


try {
  const user=await UserModel.findById(id)   
  if(user){
const {password,...otherDetails}=user._doc
// const {username,password,...otherDetails}=user._doc

     res.status(200).json(otherDetails)  

  }else{
   res.status(404).json("no user such user exist")
  }
   
} catch (error) {
   res.status(500).json(error)
}}



//update user,user only can edit themself-----------------------------------------------

export const updateUser=async (req,res)=>{  
   // console.log(req.body); `      
 const id=req.params.id 
 const {_id,password}=req.body
 // _id jwt token id(authmiddleware)
 if(id===_id){  

try {

   if(password){     
      const salt=await bcrypt.genSalt(10)
      req.body.password= await bcrypt.hash(password,salt)
   }

   const user=await UserModel.findByIdAndUpdate(id,req.body,{new:true})
   const token=jwt.sign( 
      {username:user.username,id:user._id },
      process.env.JWT_KEY,
      {expiresIn:"1h"}
   )
   res.status(200).json({user,token})     
} catch (error) {
   res.status(500).json(error)
}
 }else{
   res.status(403).json("Access denied! please try to edit yourown account details")
 }

}



//delete user-------------------------------------------------

export const deleteUser=async (req,res)=>{
   const id=req.params.id
    const {_id}=req.body  // _id=currentUserId
   //  console.log(_id,"currentUserId");
    if(_id===id){
      try {
         await UserModel.findByIdAndDelete(_id)        
         res.status(200).json("successufully deleted your account")   
      } catch (error) {
         res.status(500).json(error)
      }
    }else{
   res.status(403).json("Access denied! please try to edit yourown account details")
      
    }
}






//follow a user----------------------------------------------------

export const followUser=async (req,res)=>{
const id=req.params.id
const {_id}=req.body
console.log(req.body,"req.body");  
console.log(id,"params id");
//id=our followers id, _id=our id 
//following our own account is restricted
if(_id===id){
res.status(403).json("action restricted")
}else{
try {
   // follower = the user we follow
   // ourData = current user
   const follower=await UserModel.findById(id)  
   const ourData=await UserModel.findById(_id)

if(!follower.followers.includes(_id)){
   //pushing our id into the follower's accouct
     await follower.updateOne({$push:{followers:_id}})  
   //pushing follower's id to our accouct
     await ourData.updateOne({$push:{following:id}})
     res.status(200).json("user followed")
}else{
   res.status(403).json("user is already followed by you")
}
} catch (error) {
   console.log(error);
   res.status(403).json("Access denied! please try to edit yourown account details")
}
}
}


//unfollow users-------------------------------------------------------------


export const UnfollowUser=async (req,res)=>{
   const id=req.params.id
   const {_id}=req.body
   //id=our follower's id, _id=our id
   //following our own account is restricted (not required)   
   if(_id===id){
   res.status(403).json("action restricted")
   }else{
   try {
      const follower=await UserModel.findById(id)
      const ourData=await UserModel.findById(_id)
   if(follower.followers.includes(_id)){
      //removing our id from the follower's accouct
        await follower.updateOne({$pull:{followers:_id}})
      //removing follower's id from our accouct
        await ourData.updateOne({$pull:{following:id}})
        res.status(200).json("user Unfollowed")
   }else{
      res.status(403).json("this user is not followed by you")
   }
   } catch (error) {
      console.log(error);
      res.status(403).json("Access denied! please try to edit yourown account details")
   }
   }
   }


   export const blockUser=async(req,res)=>{
    const user=await UserModel.findById(req.params.userId)   
   //  console.log(user,"user");
    if(user.isBlocked){
      await user.updateOne({ $set: { isBlocked:false }})
      res.status(200).json("user unblocked")
    }else{
      await user.updateOne({ $set: {isBlocked:true }})  
      res.status(200).json("user blocked")
    }
   }
   

