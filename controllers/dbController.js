
const Database = require('better-sqlite3');

const path = require('path')



const getAllTableHandler = (req, res) => {
    const DB_filename = process.env.DB_FILENAME
    const db = new Database('./database/' + DB_filename, { verbose: null });
    const statement = db.prepare(`SELECT name FROM sqlite_schema WHERE type ='table' AND name NOT LIKE 'sqlite_%'`);
    const result = statement.all();
    res.status(200).json(result);
}


const showOperPageHandler = (req, res) => {
    const dbID = req.query.db
    switch (dbID) {
        case "2":
            process.env.DB_FILENAME = process.env.DB_FILENAME_OPT_2
            break;
        case "1":
            process.env.DB_FILENAME = process.env.DB_FILENAME_OPT_1
            break;

        default:
            process.env.DB_FILENAME = process.env.DB_FILENAME_OPT_1
            break;
    }

    console.log(process.env.DB_FILENAME)

    res.status(200).sendFile(path.join(__dirname, '..', 'views', 'table', 'tableOper.html'))
}




module.exports = { getAllTableHandler, showOperPageHandler }