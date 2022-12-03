const Database = require('better-sqlite3');
const db = new Database('./database/chinook.db', { verbose: console.log });


const getAllFromTableHandler = (req, res) => {
    // console.log("aa",req.body.tableName,req.body.limit,req.body.offset)
    let limit2=req.body.limit?req.body.limit:25
    let offset2=req.body.offset?req.body.offset:0
    console.log(req.body.tableName,limit2, offset2)
    const statement = db.prepare(`select * from ${req.body.tableName} limit ${limit2} offset ${offset2}`);
    const result = statement.all();
    if (result.length == 0 || !result) {
        return res.status(200).json( [{ "message": "no data returned" }])
    }

    res.json(result);
}


module.exports = { getAllFromTableHandler }