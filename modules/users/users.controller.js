const express = require('express')
const userRouter = express.Router();
const user = require('./users.model');
const { Types } = require('mongoose');
const multer = require('multer');
const path = require('path')


//Storage configuration

const storage = multer.diskStorage({
    destination: function (req, file, callback){
        callback(null, 'uploads/')
    },
    filename: function (req, file, callback){
        const filename = Date.now() + "-" + Math.round(Math.random() * 1E9);
        callback(null, filename + path.extname(file.originalname))
    }
})
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  };

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
})


userRouter.post('/create', upload.single('image'), async (req, res)=>{
    const {name, email, password} = req.body
    try{

        //Checking the email address is already registered
        const existingemail = await user.findOne({email})
        if(existingemail){
            return res.status(400).json({
                message: "Email address is already registered"
            })
        }
        //Creating the new user
        const newUser = new user({
            name, email, password, image: req.file ? req.file.filename : null
        })
            const response = await newUser.save()
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

userRouter.post('/login/', async(req, res)=>{
        const {emailId, password} = req.body;
    try{
        const checkUser = await user.findOne({emailId})

        if(!checkUser || checkUser.password !== password){
            return res.status(401).json({
                message: "Invalid email address or password"
            })
        
            return res.status(200).json({
                message: "Login Success",
                user: checkUser
            })
        }
    }catch(err){
        return res.status(500).json({
            message: "Unable to connect to server"
        })
    }

userRouter.post('/login', async(req, res)=>{
    const {email, password} = req.body

    try{
        const checkuser = await user.findOne({email})

        if(!checkuser || checkuser.password !== password){
            return res.status(400).json({
                message: "Invali user email or password"
            })
        }
        return res.status(200).json({
            message: "Login successful",
            data: checkuser
        })
    }catch(err){
        return res.status(500).json({
            message: "Unable to connect to the server",
            err
        })
    }
})

module.exports = userRouter;