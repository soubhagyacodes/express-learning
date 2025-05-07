import passport from "passport";
import e from "express";
import { Strategy } from "passport-local";
import {users} from "../utils/userData.js"


export default passport.use(
    new Strategy((username, password, done) => {
        try {
            const foundUser = users.find((user)=> user.username === username)
            if(!foundUser) throw new Error("User Not Found")
            if(foundUser.password !== password) throw new Error("Not Authenticated. Wrong Password")
            return done(null, foundUser)
            
        } catch (error) {
            return done(error)
        }
    })
)

passport.serializeUser((user, done) => { // What is to be saved in session token out of the passed value in strategy
    done(null, user.id)
})

passport.deserializeUser((id, done) => { // Value to be assigned to request after a request is made.
    const findUser = users.find((u) => u.id == id)
    done(null, findUser)
})