require('dotenv').config()
const mongoose = require('mongoose')


const connectionString = process.env.MONGO_URI;

function connectDB(){ 
    mongoose.connect(connectionString)
    .then(console.log('database is connected'))
    .catch((err)=>{
        console.log('big failure')
    })
}
module.exports = connectDB;