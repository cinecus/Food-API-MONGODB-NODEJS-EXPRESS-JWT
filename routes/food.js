const express = require('express')
const router = express.Router()

const {getAllFoods,getFood,createFood,updateFood,deleteFood} = require('../controllers/food')

router.route('/').get(getAllFoods).post(createFood)
router.route('/:id').get(getFood).patch(updateFood).delete(deleteFood)



module.exports = router