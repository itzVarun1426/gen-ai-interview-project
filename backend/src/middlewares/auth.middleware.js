import jwt from 'jsonwebtoken';
import blacklistedTokenModel from '../models/blacklist.model.js';

async function  authUser(req,res,next){
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({
            message:"token not provided"
        })
    }

    const isTokenBlacklisted  = await blacklistedTokenModel.findOne({token});
    if(isTokenBlacklisted){
        return res.status(401).json({
            message:"unauthorized blacklisted token"
        })
    }
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.decoded = decoded;
        next();
    }
    catch(err){
        console.log(err);
        return res.status(401).json({
            message:"unauthorized"
        })

    }
}

export default {authUser}
