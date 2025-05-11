import mongoose from "mongoose";

const GoogleuserSchema = new mongoose.Schema({
    googleID: {
        type: String,
        required: true,
        lowercase: true,
    }, // profile.sub
    fullName : {
        type: String,
        default: "Not Specified" // profile.name
    },
    email : {
        type: String, // profile.emails[0].value
    },
    picture: {
        type: String,
    }
}, { timestamps: true })

const GoogleUser = mongoose.model("GoogleUser", GoogleuserSchema)

export default GoogleUser;