import express from "express";
import 'dotenv/config';

const app = express();

app.get("/", (request, response) => {
    response.send("Home Page");
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on the port ${process.env.PORT}`);
})