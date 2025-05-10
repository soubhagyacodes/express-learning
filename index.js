import express from "express";
import 'dotenv/config';
import session from "express-session";
import userRoutes from "./routes/userRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import { users } from "./utils/userData.js";
import passport from "passport";
import "./strategies/local-strategy.js"
import mongoose from "mongoose";

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
    }
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

app.get("/", (request, response) => {
    // response.cookie("naam" , "lakhan", {maxAge: 60000 * 60})
    // console.log(request.session)
    // console.log(request.session.id)
    // request.session.visited = true
    response.status(200).send({ "message": "Working" , "loggedinUser": request.user ?? "Not Logged In"});
})
