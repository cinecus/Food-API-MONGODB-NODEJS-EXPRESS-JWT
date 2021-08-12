const mongoose = require('mongoose')

const StudentSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true,'Please provide student name']
        },
        score:{
            type:Number,
            required:[true,'Please provide score']
        },
        grade:{
            type:String,
            default:'X'
        },
        id:{
            type:String,
            default:'643'+(Math.floor(Math.random()*(10000-1000+1))+1000).toString()+'21',
            require:[true,'Please provide id']
        }
    },
    {timestamps:true}
)


module.exports = mongoose.model('Student',StudentSchema)