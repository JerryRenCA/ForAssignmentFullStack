const express = require('express')
const router = express.Router()
const tableController = require('../controllers/tableController')

// console.dir(tableController)
// router: url=table/
router.route('/')
    .post(tableController.getAllFromTableHandler)
    .put(tableController.updateRowFromTableHandler)
    .delete(tableController.delRowFromTableHandler)
router.route('/rowcount')
    .post(tableController.getRowsCountOfTableHandle)
router.route('/colinfo')
    .post(tableController.getTableColumnsInfo)
router.route('/addNewRow')
    .post(tableController.addNewRowToTableHandler)
module.exports = router

