import express from "express";
import 'dotenv/config';
import session from "express-session";
import userRoutes from "./routes/userRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import { users } from "./utils/userData.js";
import passport from "passport";
import "./strategies/local-strategy.js"

export const app = express();

const PORT = process.env.PORT || 3000;


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

app.get("/", (request, response) => {
    // response.cookie("naam" , "lakhan", {maxAge: 60000 * 60})
    // console.log(request.session)
    // console.log(request.session.id)
    // request.session.visited = true
    response.status(200).send({ "message": "Working" });
})

app.post("/api/auth", passport.authenticate('local', {failureRedirect: "/", failureMessage: "WRONG PASSWORD"}), (request, response)=> {
    response.send({msg: "Logged In Successfully"})
})
