const mongoose = require('mongoose')
const usersSchema = require('./users.schema')


const usersModel = mongoose.model('users', usersSchema)


module.exports = usersModel;


