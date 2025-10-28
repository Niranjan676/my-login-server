const mongoose = require('mongoose')
const URI = "mongodb://localhost:27017"

function database_connection(){
    try{
        // console.log(URI)
        mongoose.connect(URI, {
            dbName: 'testing'
        })
    }catch(err){
        console.log("Error connecting to database", err)
    }
}

console.log("DB connected", database_connection)

module.exports = { database_connection } 