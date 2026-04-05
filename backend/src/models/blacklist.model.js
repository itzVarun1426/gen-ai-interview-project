import mongoose from "mongoose";

const blacklistedTokenSchema = new mongoose.Schema({
    token:{
        type:String,
        required:true
    }

});

const blacklistedTokenModel = mongoose.model("BlacklistedToken",blacklistedTokenSchema);

export default blacklistedTokenModel;