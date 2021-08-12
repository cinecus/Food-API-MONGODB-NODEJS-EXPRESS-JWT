const Food = require('../models/Food')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')


const getAllFoods = async (req,res)=>{
    const {name,category,numericFilters} = req.query
    let queryObject = {}
    queryObject.createdBy = req.user.userId
    if(name){
        queryObject.name = {$regex:name, $options:'i'}
    }
    if(category){
        queryObject.category = category
    }
    if(numericFilters){
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte',
          }
        const regEx = /\b(<|>|>=|=|<|<=)\b/g
        let filters = numericFilters.replace(
            regEx,
            (match) => `-${operatorMap[match]}-`
        )
        const options = ['price']
        filters = filters.split(',').forEach((item) => {
            const [field, operator, value] = item.split('-')
            if (options.includes(field)) {
              queryObject[field] = { [operator]: Number(value) }
            }
        })
    }
    let result = Food.find(queryObject)

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page-1)*limit
    result = result.skip(skip).limit(limit)
    
    const foods = await result
    // const foods = await Food.find({createdBy: req.user.userId}).sort('CreatedAt')
    res.status(StatusCodes.OK).json({foods, count:foods.length})
}

const getFood = async(req,res)=>{
    const {
        user:{userId},
        params:{id:foodId}
    } = req
    const food = await Food.findOne({
        _id:foodId,
        createdBy:userId
    })
    if(!food){
        throw new NotFoundError(`No food with id ${foodId}`)
    }
    res.status(StatusCodes.OK).json({food})
}

const createFood = async(req,res)=>{
    req.body.createdBy = req.user.userId
    const food = await Food.create(req.body)
    res.status(StatusCodes.CREATED).json({food})
}

const updateFood = async(req,res)=>{
    const{
        body:{name, price, category},
        user:{userId},
        params:{id:foodId}
    } = req
    if(name ==='' || price===''){
        throw new BadRequestError('Food or Price fields cannot be empty')
    }
    const food = await Food.findOneAndUpdate(
        {_id: foodId, createdBy: userId},
        req.body,
        {new:true, runValidators:true}
    )
    if(!food){
        throw new NotFoundError(`No food with id ${foodId}`)
    }
    res.status(StatusCodes.OK).json({food})
}

const deleteFood = async(req,res)=>{
    const{
        user:{userId},
        params:{id:foodId}
    } = req
    const food = await Food.findOneAndRemove({
        _id:foodId,
        createdBy:userId
    })
    if(!food){
        throw new NotFoundError(`No food with id ${foodId}`)
    }
    res.status(StatusCodes.OK).send()
}

module.exports = {
    getAllFoods,
    getFood,
    createFood,
    updateFood,
    deleteFood
}