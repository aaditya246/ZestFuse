import mongoose from "mongoose" ;

export const connectDB = async () =>{
    await mongoose.connect('mongodb+srv://aadityav417:tEEaioRHXVeZUe9r@cluster0.rlntx.mongodb.net/ZestFuse').then (()=>console.log("DB Connected"));
}