const Student = require('../models/Student')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

const getAllStudent = async(req,res)=>{
    const {name, grade, numericFilters} = req.query
    let queryObject = {}
    if(name){
        queryObject.name = {$regex:name, $options:'i'}
    }
    if(grade){
        queryObject.grade = grade
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
        const options = ['score']
        filters = filters.split(',').forEach((item) => {
            const [field, operator, value] = item.split('-')
            if (options.includes(field)) {
              queryObject[field] = { [operator]: Number(value) }
            }
        })
    }
    let result = Student.find(queryObject).sort('id')
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page-1)*limit
    result = result.skip(skip).limit(limit)
    const students = await result
    res.status(StatusCodes.OK).json({students})
}
const getStudent = async(req,res)=>{
    const {
        params:{id:studentId}
    } = req
    const student = await Student.findOne({
        id:studentId
    })
    if(!student){
        throw new NotFoundError(`No student with id ${studentId}`)
    }
    res.status(StatusCodes.OK).json({student})
}
const createStudent = async(req,res)=>{
    const student = await Student.create({...req.body,id:`643${(Math.floor(Math.random()*(10000-1000+1))+1000).toString()}21`})
    res.status(StatusCodes.CREATED).json({student})
}
const editStudent = async(req,res)=>{
    const{
        body:{name,score},
        params:{id:studentId}
    }=req
    if(name ==='' || score===''){
        throw new BadRequestError('Name or Score fields cannot be empty')
    }
    const student = await Student.findOneAndUpdate({id:studentId},req.body,{new:true,runValidators:true})
    if(!student){
        throw new NotFoundError(`No student with id ${studentId}`)
    }
    res.status(StatusCodes.OK).json({student})
}
const deleteStudent = async(req,res)=>{
    const{
        params:{id:studentId}
    } = req
    const student = await Student.findOneAndRemove({
        id:studentId
    })
    if(!student){
        throw new NotFoundError(`No student with id ${studentId}`)
    }
    res.status(StatusCodes.OK).send(`Delete student with id ${studentId} already!`)
}

module.exports ={
    getAllStudent,
    getStudent,
    createStudent,
    editStudent,
    deleteStudent
}