import express from "express";
const app=express()
import "dotenv/config";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js"

//middlewears
app.use(express.json());
app.use(cookieParser());

app.get("/",(req,res)=>{
res.send("hii")
})
app.use("/api/user",userRoutes)

app.listen(process.env.PORT,()=>{
    console.log(`server running on ${process.env.PORT}`)
})