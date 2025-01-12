const {Router} = require("express");
const adminRouter = Router();
const jwt = require("jsonwebtoken");
const { adminModel, courseModel } = require("../db");
const bcrypt = require("bcrypt");
const { adminMiddleware } = require("../middleware/admin");
const {admin_jwt_password } = require("../config.js")

adminRouter.post("/signup", async (req, res) =>{
    const { email, password, firstName, lastName } = req.body;
    const hashedpassword = await bcrypt.hash(password, 5);

    try {
        adminModel.create({
            email,
            password: hashedpassword,
            firstName: firstName,
            lastName: lastName,
        })
    } catch (error) {
        res.status(500).json({
            message: "Error signing up! Try again later"
        })
    }
})

adminRouter.post("/signin", async (req, res) =>{
    const { email, password } = req.body;
    const hashedpassword = await bcrypt.hash(password, 5);
    const user =  await adminModel.findOne({
        email: email
    });
    const matchedpassword = bcrypt.compare(hashedpassword, password)
    if(matchedpassword){
        let token = jwt.sign({
            id: user._id
        } ,admin_jwt_password);
        res.json({
            token: token
        })
    }else{
        res.status(403).json({
            message: "Wrong Credentials!"
        })
    }
});

// Watch creating a Web3 Saas in 6 hours !

adminRouter.post("/course", adminMiddleware, async (req, res) =>{
    const adminId = req.admin_id;

    const { title, description, price, imageUrl, creatorId }  = req.body;

    const course = await courseModel.create({
        title,
        description,
        price,
        imageUrl,
        creatorId: adminId
    })
    res.json({
        message: "Course created!",
        courseId: course._id
    })
})

adminRouter.put("/course", adminMiddleware, async (req, res) =>{
    const adminid = req.admin_id;
    const { title, description, price, imageUrl, courseId } = req.body;
    const course = await courseModel.updateOne({
        _id: courseId,                       // important check so that no other creator can change other than his courses
        creatorId: adminid
    },{
        title: title,
        description: description,
        price: price,
        imageUrl: imageUrl
    })
    res.json({
        message: "Course updated!",
        courseId: course._id
    })
})

adminRouter.get("/course/bulk", adminMiddleware, async (req, res) =>{
        const adminid = req.admin_id;
        const courses = await courseModel.find({
            creatorId: adminid
        })
        res.json({
            message: "You're coursees are:",
            courses
        })
})



module.exports = {
    adminRouter: adminRouter
}