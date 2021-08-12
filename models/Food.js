const mongoose = require('mongoose')

const FoodSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true,'Please provide food name']
        },
        category:{
            type:String,
            enum:['Main course','Orderve','Soup','Salad','Fish dish','Meat dish','Dessert','Drink'],
            default:'Main course'
        },
        price:{
            type: Number,
            required:[true,'Please provide food price']
        },
        createdBy:{
            type:mongoose.Types.ObjectId,
            ref:'User',
            require:[true, 'Please provide user']
        }
    },
    {timestamps:true}
)

module.exports = mongoose.model('Food',FoodSchema)