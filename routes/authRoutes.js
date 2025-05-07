import { Router } from "express";
import { users } from "../utils/userData.js";

const router = Router();

router.post("/api/local/auth", (request, response) => {
    const { body : {username, password} } = request;

    // Finding User
    const foundUser = users.find((user) => user.username === username)
    if(!foundUser || foundUser.password !== password) return response.status(401).send({msg : "BAD CREDENTIALS"})
        
    request.session.user = foundUser
    return response.status(201).send({msg : "LOGGED IN", user: foundUser})
})

router.get("/api/local/auth/status", (request, response) => {
    if(!request.session.user){
        return response.status(401).send({msg : "NOT AUTHORIZED"})
    }
    return response.status(200).send(request.session.user)
})

export default router;