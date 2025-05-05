import express from "express";
import 'dotenv/config';
import session from "express-session";
import userRoutes from "./routes/userRoutes.js"

export const app = express();

const PORT = process.env.PORT || 3000;

// MIDDLEWARES
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
    console.log(request.session)
    response.status(200).send({ "message": "Working" });
})

app.listen(PORT, () => {
    console.log(`Server is running on the port ${PORT}`);
})
