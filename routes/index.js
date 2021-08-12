const express = require('express')
const router = express.Router()

router.route('/').get((req,res)=>res.send("<h1>Index</h1>"))

module.exports = router