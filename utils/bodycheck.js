import express from "express";
import { body, ExpressValidator } from "express-validator";


const bodyCheck = {
    username: {
        notEmpty: {
            errorMessage: "Username can't be empty"
        },
        exists: {
            errorMessage: "Username must exist"
        },
        isLength: {
            options: { max: 15 },
            errorMessage: "Username can be maximum of 15 characters"
        }
    },
    fullName: {
        isLength: {
            options: { max: 35 },
            errorMessage: "Full Name can be maximum of 35 characters"
        }
    },
    password: {
        in: ['body'],
        exists: {
            errorMessage: "Password must exist"
        },
        isLength: {
            options: { min: 8 },
            errorMessage: "Password must be atleast 8 characters long."
        }
    }
}

export default bodyCheck