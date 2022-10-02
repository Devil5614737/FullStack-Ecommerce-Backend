const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const validate = require("../Validations/validateLogin");
const jwt = require("jsonwebtoken");

router.post('/login',async(req,res)=>{
    const {email,password}=req.body;
const newUser=new User({
    email,password
})

    const error=validate(req.body);
    if(error) return res.status(400).json(error.details[0].message);


    try {
        const user = await User.findOne({ email });
    
        if (user) {
          const validPassword = await bcrypt.compare(
            newUser.password,
            user.password
          );
          if (validPassword) {
            const token = jwt.sign(
              {
                _id: user._id,
                username: user.username,
                email: user.email,
              },
              process.env.PRIVATE_KEY
            );
            res.status(200).json(token);
          } else {
            res.status(400).json("Invalid credentials");
          }
        } else if (!user) {
          res.status(400).json("Invalid credentials");
        }
      } catch (e) {
        console.log(e);
      }


})


module.exports=router;