import express from "express";
import 'dotenv/config';
import session from "express-session";
import userRoutes from "./routes/userRoutes.js"
import { users } from "./utils/userData.js";

export const app = express();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on the port ${PORT}`);
})


app.use(express.json())
app.use(session({
    secret: 'secret_code',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60000 * 60 * 24
    }
}))
app.use(userRoutes)

app.get("/", (request, response) => {
    // response.cookie("naam" , "lakhan", {maxAge: 60000 * 60})
    console.log(request.session)
    console.log(request.session.id)
    request.session.visited = true
    response.status(200).send({ "message": "Working" });
})

app.post("/api/auth", (request, response) => {
    const { body : {username, password} } = request;

    // Finding User
    const foundUser = users.find((user) => user.username === username)
    if(!foundUser || foundUser.password !== password) return response.status(401).send({msg : "BAD CREDENTIALS"})
        
    request.session.user = foundUser
    return response.status(201).send({msg : "LOGGED IN", user: foundUser})
})

app.get("/api/auth/status", (request, response) => {
    if(!request.session.user){
        return response.status(401).send({msg : "NOT AUTHORIZED"})
    }
    return response.status(200).send(request.session.user)
})