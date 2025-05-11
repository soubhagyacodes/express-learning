import express from "express";
import 'dotenv/config';
import session from "express-session";
import userRoutes from "./routes/userRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import passport from "passport";
import "./strategies/google-strategy.js"
import "./strategies/local-strategy.js"
import mongoose from "mongoose";
import GoogleUser from "./models/google-users.model.js";
import MongoStore from "connect-mongo";
// import { users } from "./utils/userData.js";

export const app = express();

const PORT = process.env.PORT || 3000;

mongoose.connect("mongodb://localhost:27017/learn")
.then(() => console.log("db connected"))
.catch((err) => console.log(`Error connecting DB. Error: \n${err}`))

app.use(express.json())
app.use(session({
    secret: 'secret_code',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60000 * 60 * 24
    },
    store: MongoStore.create({
        client: mongoose.connection.getClient()
    })
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(userRoutes)
app.use(authRoutes)


app.listen(PORT, () => {
    console.log(`Server is running on the port ${PORT}`);
})

app.get("/farzi", (request, response) => {
    console.log(request.user)
})

app.post("/api/auth", passport.authenticate('local', {failureRedirect: "/", failureMessage: "WRONG PASSWORD"}), (request, response)=> {
    response.send({msg: "Logged In Successfully"})
})

app.get("/",(request, response) => {
    // response.cookie("naam" , "lakhan", {maxAge: 60000 * 60})
    // console.log(request.session)
    // console.log(request.session.id)
    // request.session.visited = true
    response.status(200).send({ "message": "Working" , "loggedinUser": request.user ?? "Not Logged In"});
})

app.get("/api/auth/google", passport.authenticate("google"))

app.get("/api/auth/google/protected", passport.authenticate("google") , (request, response) => {
    response.status(200).send({ "message": "Working" , "loggedinUser": request.user ?? "Not Logged In"});
})

app.get("/api/auth/google/logout", (request, response) => {
    request.logout((err) => {
        if(err) return next(err)
        response.redirect("/")
    })
})

app.get("/api/google/users", async (request, response) => {
    let users;
    try {
        users = await GoogleUser.find()
    } catch (error) {
        return response.status(400).send(error)
    }
    return response.status(200).send(users)
})