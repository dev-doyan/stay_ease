import express from "express";
const app=express()
import "dotenv/config";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js"
import roomRoutes from "./routes/roomRoutes.js"
import roomImageRoutes from "./routes/roomImageRoutes.js"
import bookingRoutes from "./routes/bookingRoutes.js";

//middlewears
app.use(express.json());
app.use(cookieParser());

app.get("/",(req,res)=>{
res.send("hii")
})
app.use("/api/user",userRoutes)
app.use("/api/rooms",roomRoutes)
app.use("/api",roomImageRoutes)
app.use("/api/bookings", bookingRoutes);
app.listen(process.env.PORT,()=>{
    console.log(`server running on ${process.env.PORT}`)
})