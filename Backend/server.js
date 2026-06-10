import express from "express"
import cors from "cors"
import 'dotenv/config'
import { connectDB } from "./config/db.js"
import connectCloudinary from "./config/cloudinary.js"   // 👈 add this
import foodRouter from "./routes/foodRoute.js"
import userRouter from "./routes/userRoute.js"
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"
import { v2 as cloudinary } from "cloudinary";

const app = express()

app.use(express.json())
const port = process.env.PORT || 3000;

app.use(cors({
    origin: [
        process.env.FRONTEND_URL,       // your Vercel frontend URL
        process.env.ADMIN_URL,          // your Vercel admin URL
        "http://localhost:5173",         // local frontend dev
        "http://localhost:5174",         // local admin dev
    ],
    credentials: true
}));

connectDB()
await connectCloudinary()                                // 👈 add this

app.use("/api/food", foodRouter)
app.use("/api/user", userRouter)
app.use("/api/cart", cartRouter)
app.use("/api/order", orderRouter)

app.get("/", (req, res) => {
    res.send("API Working")
})

app.listen(port, () => {
    console.log(`Server Started on http://localhost:${port}`)
})