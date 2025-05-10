import passport from "passport";
import e from "express";
import { Strategy } from "passport-local";
import User from "../models/users.model.js";
import bcrypt from "bcryptjs";


export default passport.use(
    new Strategy(async (username, password, done) => {
        try {
            const users = await User.find()
            const foundUser = users.find((user)=> user.username === username)
            if(!foundUser) throw new Error("User Not Found")
            const passResult =  await bcrypt.compare(password, foundUser.password);
            if(passResult == false) throw new Error("Not Authenticated. Wrong Password")
            return done(null, foundUser)

        } catch (error) {
            return done(error)
        }
    })
)

passport.serializeUser((user, done) => { // What is to be saved in session token out of the passed value in strategy
    done(null, user._id)
})

passport.deserializeUser(async (id, done) => { // Value to be assigned to request after a request is made.
    const users = await User.find()
    const findUser = users.find((u) => u._id == id)
    done(null, findUser)
})