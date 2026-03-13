const {model, Schema} = require('mongoose');

const userSchema= new Schema({
    FirstName:{
        type: String,
        required: true
    },
    LastName:{
        type: String,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
        length: 6,
    },
    

},{timestamps: true});

module.exports = model('User', userSchema);