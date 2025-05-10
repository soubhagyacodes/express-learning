import { Router } from "express"
import { query, body, validationResult, matchedData, checkSchema } from "express-validator"
import { users } from "../utils/userData.js"
import bodyCheck from "../utils/bodycheck.js"
import User from "../models/users.model.js"
import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const router = Router()

router.get(
    "/api/users", 
    query("filter").optional().notEmpty().withMessage("SHOULDN'T BE EMPTY").isLength({max: 20, min: 3}).withMessage("FILTER VALUE SHOULD BE BETWEEN 3 TO 20 CHARACTERS"), 
    
    async (request, response) => {
    request.sessionStore.get(request.session.id, (err, sessionData) => {
        if(err){
            console.log(err);
            throw err;
        }
        console.log(sessionData)
    })
    
    const users = await User.find()

    const result = validationResult(request)
    if(!(result.errors.length === 0)){
        return response.status(400).send({
            "message": "BAD REQUEST ERROR",
            "errors": result.errors
        })
    }

    const cleanData = matchedData(request)
    const filterValue = cleanData.filter
    const found = filterValue == undefined ? null : users.filter((user) => user.username.startsWith(filterValue))

    // if(found == null) return response.send({"message": "ERROR, No filter value provided"})

    if(filterValue && found.length == 0) return response.status(404).send({"message": "NOTHING FOUND"})

    if(filterValue) return response.status(201).send(found);


    return response.status(201).send(users);
    
    }
)

// Route Params
router.get("/api/users/:id", async (request, response) => {
    const ID = request.params.id
    console.log(ID)
    // if(isNaN(parsedID)) return response.send({ "message": "ERROR" })

    try {
        const user = await User.findById(ID)
        if(user == null){
            return response.status(404).send({"message": "NOT FOUND"})
        }
        return response.send(user)
        // const found = users.find((user) => user._id == ID)

    } catch (error) {
        return response.status(404).send({"message": "something's wrong", "error": error})
    }
})

// POST
router.post("/api/users", checkSchema(bodyCheck), async (request, response) => {
    const result = validationResult(request)
    if(!result.isEmpty()) return response.status(400).send({errors: result.errors.map((error) => {return {"field": error.path, "msg": error.msg} })})

    var data = matchedData(request)
    // data.password = await bcrypt.hash(data.password)
    const originalPass = data.password
    const hashedPass = await bcrypt.hash(originalPass, 10)
    data = {...data, password: hashedPass}
    
    const newUser = new User(data)
    try {
        await newUser.save()
        return response.status(200).send(newUser)
    } catch (error) {
        console.log(error)
        return response.status(400).send({"errorMsg": error})
    }
    
})

// PUT
router.put("/api/users/:id", (request, response) => {
    const { params : {id} , body } = request;

    const parsedId = parseInt(id)

    if(isNaN(parsedId)) return response.sendStatus(400)

    const foundIndex = users.findIndex((user) => user.id === parsedId)
    if(foundIndex == -1) return response.sendStatus(404)

    users[foundIndex] = { id: parsedId, ...body }
    return response.sendStatus(200)
})

// PATCH
router.patch("/api/users/:id", (request, response) => {
    const { params : {id} , body } = request;

    const parsedId = parseInt(id)

    if(isNaN(parsedId)) return response.sendStatus(400)

    const foundIndex = users.findIndex((user) => user.id === parsedId)
    if(foundIndex == -1) return response.sendStatus(404)

    users[foundIndex] = { id: parsedId, ...users[foundIndex], ...body }
    return response.sendStatus(200)
})

// DELETE
router.delete("/api/users/:id", (request, response) => {
    const { params : {id} } = request;

    const parsedId = parseInt(id)

    if(isNaN(parsedId)) return response.sendStatus(400)

    const foundIndex = users.findIndex((user) => user.id === parsedId)
    if(foundIndex == -1) return response.sendStatus(404)

    users.splice(foundIndex, 1)
    return response.sendStatus(200)
})

// localhost:3000/api/users
// localhost:3000/api/users?filter=sou
// localhost:3000/api/users/1

export default router;