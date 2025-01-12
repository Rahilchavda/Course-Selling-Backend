 const jwt = require("jsonwebtoken");
 const { jwt_user_password } = require("../config");
 function userMiddleware(req, res ,next){
    const token = req.headers.token;
    const decoded = jwt.verify(token,jwt_user_password);
    if(decoded){
        req.userid = decoded.id;
        next();
    }else{
        res.status(403).json({
            message: "You're not signed in"
        })
    }
 }

 module.exports = {
    userMiddleware: userMiddleware
 }