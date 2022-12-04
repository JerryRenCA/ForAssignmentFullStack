const Database = require('better-sqlite3');
const db = new Database('./database/chinook.db', { verbose: console.log });


const getAllFromTableHandler = (req, res) => {
    console.log("aa",req.body.tableName,req.body.limit,req.body.offset)
    let limit2 = req.body.limit ? req.body.limit : 25
    let offset2 = req.body.offset ? req.body.offset : 0
    console.log(req.body.tableName,limit2, offset2)
    const statement = db.prepare(`select * from ${req.body.tableName} limit ${limit2} offset ${offset2}`);
    const result = statement.all();
    
    if (result.length == 0 || !result) {
        return res.status(200).json([{ "message": "no data returned" }])
    }

    res.json(result);
}

const getRowsCountOfTableHandle=(req,res)=>{
    const tableName = req.body.tableName
    console.log(tableName)
    const statement = db.prepare(`select count(*) as rowcount from ${tableName}`)
    const rzlt=statement.all()
    console.dir(statement)
    console.dir(rzlt)
    if (rzlt.length == 0 || !rzlt) {
        return res.status(200).json([{ "message": "no data returned" }])
    }
    res.json(rzlt);
}
const delRowFromTableHandler = (req, res) => {
    const id = req.body.id;
    const idName = req.body.idName
    const tableName = req.body.tableName
    const statement = db.prepare(`delete from ${tableName} where ${idName}=?`)

    try {
        const rzlt = statement.run(id)
        res.status(200).json({ message: "Data deleted successfully",SCode:0 })
    }
    catch (err) {
        res.status(200).json({ message: "Fail to delete", SCode:1 })
    }
}

const updateRowFromTableHandler = (req, res) => {
    const id = req.body.id;
    const idName = req.body.idName
    const rowName = req.body.rowName
    const rowvalue = req.body.rowvalue
    const tableName = req.body.tableName
    // const statement=db.prepare(`update ${tableName} set ${rowName}=${rowvalue} where ${idName}=${id}`)
    const statement = db.prepare(`update ${tableName} set ${rowName}=? where ${idName}=?`)

    try {
        const rzlt = statement.run(rowvalue, id)
        res.status(200).json({ message: "Data Updated successfully",SCode:0 })
    }
    catch (err) {
        res.status(200).json({ message: "Fail to update", SCode:1 })
    }
}

module.exports = { getAllFromTableHandler, delRowFromTableHandler, updateRowFromTableHandler,getRowsCountOfTableHandle }