
const Database = require('better-sqlite3');
const db = new Database('./database/chinook.db', { verbose: null });
const path=require('path')


const getAllTableHandler=(req,res)=>{
    const statement = db.prepare(`SELECT name FROM sqlite_schema WHERE type ='table' AND name NOT LIKE 'sqlite_%'`);
    const result = statement.all();
        res.json(result);
}


const showOperPageHandler=(req,res)=>{
    res.sendFile(path.join(__dirname,'..','views','table','tableOper.html'))
}




module.exports={getAllTableHandler,showOperPageHandler}