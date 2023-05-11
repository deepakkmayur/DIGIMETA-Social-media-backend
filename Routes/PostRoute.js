import express from "express";
import {createPost,getPost,updatePost,deletePost,likePost, getTimelinePost,postComment,getComment,deleteComment} from '../Controllers/PostController.js'





const router =express.Router()
  
router.post('/',createPost)
router.get('/:id',getPost)
router.put('/:id',updatePost)
router.delete('/:id/delete',deletePost)   
router.put('/:id/like',likePost)
router.get('/:id/timeline',getTimelinePost)

//comment 
router.post('/:id/:userId/comment',postComment)
router.get('/:id/comment',getComment)
router.delete('/:id/comment',deleteComment)



export default router