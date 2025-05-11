import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import { configDotenv } from "dotenv";
import GoogleUser from "../models/google-users.model.js";

configDotenv();

export default passport.use(new Strategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/api/auth/google/protected",
        scope: ["email", "profile"]
    },
    async (accessToken, refreshToken, profile, done) => {
        const Profile = profile._json
        
        const user = {googleID: Profile.sub, fullName: Profile.name, email: Profile.email, picture: Profile.picture}
        let foundUser
        try {
            foundUser = await GoogleUser.findOne({ googleID: Profile.sub })
        } catch (error) {
            return done(err, null)
        }

        if(!foundUser) {
            try {
                const newUser = new GoogleUser(user)
                const savedUser = await newUser.save()
                return done(null, savedUser)
            } catch (error) {
                return done(error, null)
            }
        }
        return done(null, foundUser)
    }
))

passport.serializeUser((user, done)=> {
    done(null, user._id)
})

passport.deserializeUser(async (id, done)=> {
    try {  
        const foundUser = await GoogleUser.findById(id)
        done(null, foundUser)
    } catch (error) {
        done(error, null)
    }
})