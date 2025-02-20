const Database = require('better-sqlite3');



const getAllFromTableHandler = (req, res) => {
    const DB_filename = process.env.DB_FILENAME
    const db = new Database('./database/' + DB_filename, { verbose: null });
    // console.log("aa",req.body.tableName,req.body.limit,req.body.offset)
    let limit2 = req.body.limit ? req.body.limit : 25
    let offset2 = req.body.offset ? req.body.offset : 0
    // console.log(req.body.tableName,limit2, offset2)
    const statement = db.prepare(`select * from ${req.body.tableName} limit ${limit2} offset ${offset2}`);
    const result = statement.all();

    if (result.length == 0 || !result) {
        return res.status(200).json([{ "message": "no data returned" }])
    }

    res.json(result);
}

const getRowsCountOfTableHandle = (req, res) => {
    const DB_filename = process.env.DB_FILENAME
    const db = new Database('./database/' + DB_filename, { verbose: null });
    const tableName = req.body.tableName

    const statement = db.prepare(`select count(*) as rowcount from ${tableName}`)
    const rzlt = statement.all()

    if (rzlt.length == 0 || !rzlt) {
        return res.status(200).json([{ "message": "no data returned" }])
    }
    res.json(rzlt);
}
const getTableColumnsInfo = (req, res) => {
    const DB_filename = process.env.DB_FILENAME
    const db = new Database('./database/' + DB_filename, { verbose: null });
    const { tableName } = req.body
    // console.dir(req.body)
    // console.dir(req.body.tableName)
    // console.dir(tableName)
    const statement = db.prepare(`PRAGMA table_info(${tableName})`)
    // cid/name/type/notnull/dflt_value/pk

    const rzlt = statement.all()
    if (rzlt.length == 0 || !rzlt) {
        return res.status(200).json([{ "message": "no data returned" }])
    }
    res.json(rzlt);
}

const delRowFromTableHandler = (req, res) => {
    const DB_filename = process.env.DB_FILENAME
    const db = new Database('./database/' + DB_filename, { verbose: null });
    const id = req.body.id;
    const idName = req.body.idName
    const tableName = req.body.tableName
    const statement = db.prepare(`delete from ${tableName} where ${idName}=?`)

    try {
        const rzlt = statement.run(id)
        res.status(200).json({ message: "Data deleted successfully", SCode: 0 })
    }
    catch (err) {
        res.status(200).json({ message: "Fail to delete", SCode: 1 })
    }
}

const updateRowFromTableHandler = (req, res) => {
    const DB_filename = process.env.DB_FILENAME
    const db = new Database('./database/' + DB_filename, { verbose: null });
    const id = req.body.id;
    const idName = req.body.idName
    const rowName = req.body.rowName
    const rowvalue = req.body.rowvalue
    const tableName = req.body.tableName
    // const statement=db.prepare(`update ${tableName} set ${rowName}=${rowvalue} where ${idName}=${id}`)
    const statement = db.prepare(`update ${tableName} set ${rowName}=? where ${idName}=?`)

    try {
        const rzlt = statement.run(rowvalue, id)
        res.status(200).json({ message: "Data Updated successfully", SCode: 0 })
    }
    catch (err) {
        res.status(200).json({ message: "Fail to update", SCode: 1 })
    }
}

const addNewRowToTableHandler = (req, res) => {
    const DB_filename = process.env.DB_FILENAME
    const db = new Database('./database/' + DB_filename, { verbose: null });
    const tableName = req.body.tableName;
    const colNames = req.body.colNames;
    const names = colNames.join(',')
    const atNames = '@' + colNames.join(',@')
    const colValues = req.body.colValues
    const values = '"' + colValues.join('","') + '"'
    // console.log(tableName,names,values)
    const obj = {};
    for (let i = 0; i < colNames.length; i++) {
        obj[colNames[i]] = colValues[i];
    }
    // const sql = `insert into ${tableName} (${names}) values(${values})`
    const sql = `insert into ${tableName} (${names}) values(${atNames})`
    const statement = db.prepare(sql)
    // console.dir(sql)
    // console.dir(statement)
    // console.dir(obj)
    try {
        const rzlt = statement.run(obj)
        // const rzlt=db.exec(sql)
        res.status(200).json({ message: "Added successfully", SCode: 0 })
    }
    catch (err) {
        // console.error(err)
        res.status(200).json({ message: "Fail to add new row", SCode: 1 })
    }
}
module.exports = {
    getAllFromTableHandler, delRowFromTableHandler, updateRowFromTableHandler,
    getRowsCountOfTableHandle, getTableColumnsInfo, addNewRowToTableHandler
}