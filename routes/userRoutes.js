import { Router } from "express"
import { query, body, validationResult, matchedData } from "express-validator"
import { users } from "../utils/userData.js"

const router = Router()

router.get(
    "/api/users", 
    query("filter").optional().notEmpty().withMessage("SHOULDN'T BE EMPTY").isLength({max: 20, min: 3}).withMessage("FILTER VALUE SHOULD BE BETWEEN 3 TO 20 CHARACTERS"), 
    
    (request, response) => {

    console.log(request.session.id)
    request.sessionStore.get(request.session.id, (err, sessionData) => {
        if(err){
            console.log(err);
            throw err;
        }
        console.log(sessionData)
    })


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
router.get("/api/users/:id", (request, response) => {
    const parsedID = parseInt(request.params.id)
    console.log(parsedID)
    if(isNaN(parsedID)) return response.send({ "message": "ERROR" })
    
    const found = users.find((user) => user.id === parsedID)

    if(!found) return response.status(404).send({"message": "NOT FOUND"})

    return response.send(found)
})

// POST
router.post("/api/users", (request, response) => {
    const { body } = request;
    const newUser = {id: users[users.length - 1].id + 1, ...body}
    users.push(newUser)
    return response.send(newUser)
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