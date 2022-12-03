const express=require('express')
const router=express.Router()
const tableController=require('../controllers/tableController')

console.dir(tableController)

router.route('/').post(tableController.getAllFromTableHandler)


module.exports=router

