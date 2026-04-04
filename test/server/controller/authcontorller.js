const mongoose = require('mongoose');
const User = require('../model/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const signUp= async(req, res)=>{
    const {firstName, lastName, email, password}= req.body;
    try {
        const existingUser= await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message: 'User already exists'});
        }
        const hashedPassword= await bcrypt.hash(password, 10);
        const newuser= new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });
        await newuser.save();
        if(!newuser){
            navigate('/signup');
            return res.status(500).json({message: 'Error creating user'});
            
        }
        res.status(201).json({message: 'User created successfully'});
        navigate('/dashboard');


    } catch (error) {
        res.status(500).json({message: 'Error creating user'});
    }
}
const login= async(req, res)=>{
    const {email, password}= req.body;
    try {
        const user= await User.findOne({email});
        if(!user){
            return res.status(400).json({message: 'Invalid email or password'});

        }
        const isMatch= await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message: 'Invalid email or password'});    
        }
        const token= jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
        if(!token){

            return res.status(500).json({message: 'Error generating token'});
        }
        res.status(200).json({token});

        navigate('/dashboard');
    } catch (error) {
        res.status(500).json({message: 'Error logging in'});
        navigate('/login');
    }
}
const 
module.exports= {signUp, login};