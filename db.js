const mongoose = require('mongoose')
require("dotenv").config()

const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB Connected!")
    }
    catch(err){
        console.log("Database Connection Unseccusful")
        console.error(err)
        process.exit(1)
    }
}

const disconnectDB = async () => {
    await mongoose.disconnect()
    console.log("MongoDB disconnected")
    process.exit(0)
}

const isConnected = () => {
    return mongoose.connection.readyState === 1;
}

module.exports = { connectDB , disconnectDB , isConnected}