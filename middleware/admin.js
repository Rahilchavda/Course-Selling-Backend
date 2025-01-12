const jwt = require("jsonwebtoken");
const { admin_jwt_password } = require("../config");
const admin = require("../routes/admin");

function adminMiddleware(req, res ,next){
    const token = req.headers.token;
    const decoded = jwt.verify(token, admin_jwt_password);
    if(decoded){
        req.admin_id = decoded.id;
        next();
    }
    else{
        res.status(403).json({
            message: "You're not signed in!"
        });
    }
}

module.exports = {
    adminMiddleware: adminMiddleware
};