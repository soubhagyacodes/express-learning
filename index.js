import express from "express";
import 'dotenv/config';
import { parse } from "dotenv";

const app = express();

// MIDDLEWARES
app.use(express.json())

const PORT = process.env.PORT || 3000;

const users = [
    {id: 1, username: "sobby", fullName: "Soubhagya Ranjan Mishra"},
    {id: 2, username: "shreyyy", fullName: "Shreyas Iyer"},
    {id: 3, username: "v18", fullName: "Virat Kohli"},
]


app.get("/", (request, response) => {
    response.status(200).send({ "message": "Working" });
})

app.get("/api/users", (request, response) => {
    const filterValue = request.query.filter
    const found = filterValue == undefined ? null : users.filter((user) => user.username.startsWith(filterValue))

    // if(found == null) return response.send({"message": "ERROR, No filter value provided"})

    if(filterValue && found.length == 0) return response.status(404).send({"message": "NOTHING FOUND"})

    if(filterValue) return response.status(201).send(found);


    return response.status(201).send(users);
})

// Route Params
app.get("/api/users/:id", (request, response) => {
    const parsedID = parseInt(request.params.id)
    console.log(parsedID)
    if(isNaN(parsedID)) return response.send({ "message": "ERROR" })
    
    const found = users.find((user) => user.id === parsedID)

    if(!found) return response.status(404).send({"message": "NOT FOUND"})

    return response.send(found)
})

// POST
app.post("/api/users", (request, response) => {
    const { body } = request;
    const newUser = {id: users[users.length - 1].id + 1, ...body}
    users.push(newUser)
    return response.send(newUser)
})

// PUT
app.put("/api/users/:id", (request, response) => {
    const { params : {id} , body } = request;

    const parsedId = parseInt(id)

    if(isNaN(parsedId)) return response.sendStatus(400)

    const foundIndex = users.findIndex((user) => user.id === parsedId)
    if(foundIndex == -1) return response.sendStatus(404)

    users[foundIndex] = { id: parsedId, ...body }
    return response.sendStatus(200)
})

// PATCH
app.patch("/api/users/:id", (request, response) => {
    const { params : {id} , body } = request;

    const parsedId = parseInt(id)

    if(isNaN(parsedId)) return response.sendStatus(400)

    const foundIndex = users.findIndex((user) => user.id === parsedId)
    if(foundIndex == -1) return response.sendStatus(404)

    users[foundIndex] = { id: parsedId, ...users[foundIndex], ...body }
    return response.sendStatus(200)
})

// DELETE
app.delete("/api/users/:id", (request, response) => {
    const { params : {id} } = request;

    const parsedId = parseInt(id)

    if(isNaN(parsedId)) return response.sendStatus(400)

    const foundIndex = users.findIndex((user) => user.id === parsedId)
    if(foundIndex == -1) return response.sendStatus(404)

    users.splice(foundIndex, 1)
    return response.sendStatus(200)
})


app.listen(PORT, () => {
    console.log(`Server is running on the port ${PORT}`);
})
 
// localhost:3000/
// localhost:3000/api/users
// localhost:3000/api/users?filter=sou
// localhost:3000/api/users/1