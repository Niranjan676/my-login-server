const express = require('express')
const httpServer = express();
const bodyparser = require('body-parser')
const {database_connection} = require('./database/connection')
const cors = require('cors')

//------middleware---------
httpServer.use(cors());
httpServer.use(bodyparser.json())

httpServer.use('/users', require('./modules/users/users.controller'))


httpServer.listen(3000, 'localhost', (err)=>{
    if(err){
        console.log("Error connecting to server")
    }else{
        database_connection()
        console.log("Server is connected to port 3000")
    }
})