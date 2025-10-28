const express = require('express')
const userRouter = express.Router();
const user = require('./users.model');
const { Types } = require('mongoose');


userRouter.post('/create', async (req, res)=>{
    const newUser = new user(req.body)
    try{
        const response = await user.create(newUser)
        console.log(response)
        return res.status(200).json({
            message: "user created successfully",
            data: response
        })
    }catch(error){
        return res.status(404).json({
            message: "unable to create user",
            error
        }) 
    }
})

userRouter.get('/', async (req, res)=>{
    try{
        const response = await user.find()
        if(response.length === 0){
            return res.status(404).json({
                message: "No data found"
            })
        }
        return res.status(200).json({
            message: "Users fetched successfully",
            data: response
        })
    }catch(err){
        return res.status(500).json({
            message: "Error getting the users",
            err
        })
}
})

userRouter.get('/user/:userId', async (req, res)=>{
    try{
       const { userId } = req.params
       const response =  await user.findById({_id: new Types.ObjectId(userId)})
       console.log(response)

       return res.status(200).json({
        message: "User fetched successfully",
        data: response
       })
    }catch(err){
        return res.status(500).json({
            message: "No user found",
            err
        })
    }
})

userRouter.patch('/update/:userId', async (req, res)=>{
    try{
        const {userId} = req.params;
        const response = await user.findByIdAndUpdate({_id: new Types.ObjectId(userId)}, {$set: req.body}, {new: true})
        return res.status(200).json({
            message: "User updated successfully",
            data: response
        })
    }catch(err){
        return res.status(500).json({
            message: "Invalid user",
            err
        })
    }
})

userRouter.delete('/delete/:userId', async (req, res)=>{
    try{
        const {userId} = req.params;
        const response = await user.findByIdAndDelete({_id: new Types.ObjectId(userId)})
        return res.status(200).json({
            message: "User deleted successfully",
            data: response
        })
    }catch(err){
        return res.status(500).json({
            message: "Error deleting user"
        })
    }
})

module.exports = userRouter;


