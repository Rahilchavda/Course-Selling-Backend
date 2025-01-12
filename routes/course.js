const {Router} = require("express");
const { userMiddleware } = require("../middleware/users");
const { courseModel } = require("../db");
const courseRouter = Router();

    courseRouter.get("/purchase", userMiddleware, async (req, res) => {
        const userid = req.userid;
        const courseid = req.body.courseid;
        const purchase = await courseModel.create({
            userid,
            courseid
        })
        res.json({
            message: "You've Sucessfully bought the course!",
            purchase
        })
    })

    courseRouter.get("/preview", async (req, res) => {
        const courses = await courseModel.find({});
        res.json({
            courses
        })

    })


module.exports = {
    courseRouter: courseRouter
};