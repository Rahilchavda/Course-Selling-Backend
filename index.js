require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const { userRouter } = require("./routes/users");
const { courseRouter } = require("./routes/course");
const { adminRouter } = require("./routes/admin");
const app = express();
app.use(express.json());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/admin", adminRouter);

async function main() {
    try{
    await mongoose.connect(process.env.MONGO_URL);
    app.listen(3000);
    
    await console.log("Listening to port 3000");}

    catch(error){
        console.error("Unable to connect to MongoDB or starting the server:", error);
    };
}
main();
