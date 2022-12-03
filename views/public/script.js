let pickedTableName;
let currPage = 0;
const pageLimit = 25;

let fillTableNav = async () => {
    const tables = await fetch("http://localhost:8090/db/tables").then(p => p.json())

    const tableNav = document.getElementById('table-nav')
    while (tableNav.firstChild) tableNav.removeChild(tableNav.firstChild)

    let makeATableDiv = (tableName) => {
        const aDiv = document.createElement('div')
        tableNav.appendChild(aDiv)
        aDiv.innerHTML = tableName;
        aDiv.onclick = (e) => {
            pickedTableName = e.target.innerHTML;
            console.log("tablename:", pickedTableName)
            refresh();
        }
    }
    tables.map(t => { makeATableDiv(t.name) });
}

const setPickedTableName = () => {
    const pickedTablenameTag = document.getElementById("picked-tablename");
    pickedTablenameTag.innerHTML = pickedTableName;
}

const showTable = async () => {
    let clearTable = () => {
        const tHeaderTag = document.getElementById('table-head')
        while (tHeaderTag.firstChild) tHeaderTag.removeChild(tHeaderTag.firstChild)
        const tBodyTag = document.getElementById('table-body')
        while (tBodyTag.firstChild) tBodyTag.removeChild(tBodyTag.firstChild)
    }
    clearTable();
    if (pickedTableName == undefined) return;
    const _offset=currPage*pageLimit;
    const dataRows = await fetch("http://localhost:8090/table",
        {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({ tableName: `${pickedTableName}`,limit:`${pageLimit}`,offset:`${_offset}` })
        })
        .then(p => p.json())
        // .catch((err) => {
        //     console.dir(err)
        // })
    console.log(dataRows)


    let fillTable = () => {
        const tHeaderTag = document.getElementById('table-head')
        const tBodyTag = document.getElementById('table-body')
        let fillTHead = () => {
            const aTrTag = document.createElement('tr')
            tHeaderTag.append(aTrTag)
            const aDataRow = dataRows[0]
            Object.keys(aDataRow).forEach(th => {
                const aThTag = document.createElement('th')
                aTrTag.appendChild(aThTag)
                aThTag.innerHTML = th
            })
        }
        fillTHead();
        let fillBody = () => {
            dataRows.forEach(row => {
                const aTrTag = document.createElement('tr')
                tBodyTag.append(aTrTag)
                Object.values(row).forEach(v => {
                    const aTdTag = document.createElement('td')
                    aTrTag.appendChild(aTdTag)
                    aTdTag.innerHTML = v
                })
            })
        }
        fillBody()
    }

    fillTable();
}

function refresh() {
    fillTableNav()
    setPickedTableName()
    showTable();
}

refresh();

