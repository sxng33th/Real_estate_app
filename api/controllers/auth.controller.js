import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

export const signUp = async (req, res, next) => {
    const {username, password, email} = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({username, password: hashedPassword, email});
    try {
        await newUser.save();
        res.status(201).json("User has been created");
    } catch (error) {
        next(error);
    }
};

export const signIn = async (req, res, next) => {
    const {email, password} = req.body;
    try {
       const validUser = await User.findOne({email});  
       if(!validUser) return next(errorHandler(404, "User not found"));
      const validPassword = bcryptjs.compareSync(password, validUser.password);
      if(!validPassword) return next(errorHandler(401, "Wrong credentials"));
      const token = jsonwebtoken.sign({id: validUser._id}, process.env.JWT_SECRET);
      const {password: pass, ...rest} = validUser._doc;
      res.cookie("accessToken", token, {httpOnly: true,})
      .status(200)
      .json(rest);
    } catch (error) {
        next(error);
    }
};

export const google = async (req, res, next) => {
    try {
        console.log("Received request for Google authentication:", req.body);
        const user = await User.findOne({email: req.body.email});
        if(user){
            const token = jsonwebtoken.sign({id: user._id}, process.env.JWT_SECRET);
            const {password: pass, ...rest} = user._doc;
            res.cookie("accessToken", token, {httpOnly: true,})
            .status(200)
            .json(rest);
        }else{
            const generatedPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            const newUser = new User({username: req.body.name.
                split(" ").join("").toLowerCase() +Math.random().toString(36).slice(-4,),
                password: hashedPassword,
                avatar: req.body.photo, 
                email: req.body.email});
            await newUser.save();
            const token = jsonwebtoken.sign({id: newUser._id}, process.env.JWT_SECRET);
            const {password: pass, ...rest} = newUser._doc;
            res.cookie("accessToken", token, {httpOnly: true,})
            .status(200)
            .json(rest);
        }
    } catch (error) {
        console.error("Error in Google authentication:", error);
        next(error);
        
    }
}