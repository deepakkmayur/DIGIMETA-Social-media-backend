import mongoose, { Schema } from "mongoose";

const postSchema=mongoose.Schema(
   {
      userId:{
       type:String,
       required:true
      },
       desc:String,
       likes:[],
       image:String

  },
  {timestamps:true}   
)

const PostModal=mongoose.model('posts',postSchema)

export default PostModal