const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config();
const db_url = process.env.ATLASDB_URL;

const connectDB = async()=>{
    try{
        await mongoose.connect(db_url);
        console.log("✅ MongoDB Connected Successfully");
    }catch(error){
        console.log("❌ MongoDB Connection Failed:", error.message);

    }
}

module.exports= connectDB