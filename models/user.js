const express = require('express');
const {Schema, model} = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email:{
        type:String,
        required:true,
    }
})

userSchema.plugin(passportLocalMongoose); //It automatically adds username, hash and salt fields to store the username, the hashed password and the salt value.


const User = model("User", userSchema);
module.exports=User;