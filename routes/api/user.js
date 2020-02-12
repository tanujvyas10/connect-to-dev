const express = require('express')
const router = express.Router();
const gravatar = require("gravatar")
const bcrypt= require("bcryptjs")
const jwt = require("jsonwebtoken")
const validatorRegisterInput=  require('../../validation/register')
const validatorLoginInput = require("../../validation/login")
const User= require("../../models/User")
const keys = require("../../config/keys")

const passport = require('passport')



router.get('/test',(req,res)=> res.json({msg:'users works'}))


router.post("/register",(req,res)=>{

const {errors,isValid} = validatorRegisterInput(req.body)

//check validation
if(!isValid){
    res.status(400).json(errors)

}

     User.findOne({email: req.body.email})
     .then(user=>{
         if(user){
             return res.status(400).json({email:'email already exist!!'})
         }
         else{

            const avatar = gravatar.url(req.body.email,{
                s:'200',// size
                r:'pg',// rating
                d:'mm'//default
            })


             const newUser = new User({
                 name: req.body.name,
                 email: req.body.email,
                 avatar:avatar,
                 password:req.body.password

             });


             bcrypt.genSalt(10,(err,salt)=>{
                  bcrypt.hash(newUser.password,salt,(err,hash)=>{

                    if(err){
                        throw err
                    }
                   
                    newUser.password= hash;
                    newUser.save()
                    .then(user=> res.json(user))
                    .catch(err=> console.log(err))

                  })
             })
         }
     })
})


router.post("/login",(req,res)=>{
    const {errors,isValid} = validatorLoginInput(req.body)

    //check validation
    if(!isValid){
        res.status(400).json(errors)
    
    }


    const email = req.body.email;
    const password = req.body.password;



    //find the user email

    User.findOne({email})
    .then(user=>{
        //check for user
        if(!user){
            errors.email = " user not found"
            return res.status(404).json(errors)
        }

        //check password

        bcrypt.compare(password,user.password)
        .then(isMatch=>{
            if(isMatch){
               // res.json({msg:'success'})

               const payload = { id:user.id, name:user.name, avatar:user.avatar } //create jwt payload
               //sign token
               jwt.sign(payload, 
                keys.secretOrKey,
                {expiresIn:3600 },(err, token)=>{
                     res.json({
                        success:true, 
                        token:'Bearer '+ token})
               });
            }
            else{
                errors.password = "password not correct"
                return res.status(400).json(errors)
            }
        })
    })
})


//return current user amnd access is private


router.get("/current",passport.authenticate('jwt',{session:false}),(req,res)=>{
    // res.json({msg:'Success current'})
    res.json({
        id:req.user.id,
        email:req.user.email,
        name:req.user.name
    
    })
})
module.exports = router