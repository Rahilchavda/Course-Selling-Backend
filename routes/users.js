const { Router } = require("express");
const userRouter = Router();
const { userModel, purchaseModel, courseModel } = require("../db.js");
const bcrypt = require("bcrypt");
const { jwt_user_password } = require("../config.js");
// const { use } = require("bcrypt/promises.js");

const jwt = require("jsonwebtoken");
const { userMiddleware } = require("../middleware/users.js");

console.log("Connected to");

    userRouter.post("/signup", async function (req, res) {
        const { email, password, firstName, lastName } = req.body;
        const hashedpassword = await bcrypt.hash(password,5);
        console.log("hogy 0 ");
        
            console.log("hogya");

console.log("userModel:", userModel);
        try{
            await userModel.create({
                email,
                password: hashedpassword,
                firstName: firstName,
                lastName: lastName
            })
            console.log("hoGYa1");
        } catch(e){
            res.status(500).json({
                message: "Error signing up. Please try again."
            });
        }
         
    });
    
    userRouter.post("/signin", async (req, res) => {
        const { email, password } = req.body;
        const user = userModel.findOne({
            email: email
        });
        console.log(user);
        const matchedpassword = bcrypt.compare(password, user.password);
        if(matchedpassword){
            let token = jwt.sign({
                id: user._id
            }, jwt_user_password);
            res.json({
                token: token
            })
        }
        else{
            res.status(403).json({
                message: "Wrong Credentials!"
            })
        }
    });
    
    userRouter.get("/purchases", userMiddleware, async (req, res) => {
        const userid =req.userid;
        const { title, description, price, imageUrl, creatorId }  = req.body;

        const purchases = purchaseModel.find({
            userid
        })
        let purchasedcourseid = [];
        const coursedata = await courseModel.find({
            _id: {$in: purchasedcourseid}
        })
        res.json({
            purchases,
            coursedata
        })
    })
  
 module.exports = {
    userRouter: userRouter
}