const express=require('express')
const router=express.Router()
const dbController=require('../controllers/dbController')

console.dir(dbController)
router.route('/tables').get(dbController.getAllTableHandler)
router.route('/oper').get(dbController.showOperPageHandler)

module.exports=router

