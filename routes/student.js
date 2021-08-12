const express = require('express')
const router = express.Router()
const {
    getAllStudent,
    getStudent,
    createStudent,
    editStudent,
    deleteStudent
} = require('../controllers/student')


router.route('/').get(getAllStudent).post(createStudent)
router.route('/:id').get(getStudent).patch(editStudent).delete(deleteStudent)

module.exports = router