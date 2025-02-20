let pickedTableName;
let currPage = 0;
const pageLimit = 25;
let totalPages = 0;


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
            // console.log("tablename:", pickedTableName)
            refresh();
        }
    }
    tables.map(t => { makeATableDiv(t.name) });
}

const setPickedTableName = () => {
    const pickedTablenameTag = document.getElementById("picked-tablename");
    pickedTablenameTag.innerHTML = pickedTableName;
}

const updateTableCell = async (aTdTag) => {
    // console.log("s1")
    const id = aTdTag.attributes.rowid;
    const idName = aTdTag.attributes.rowidname;
    const rowName = aTdTag.attributes.rowname
    const rowOldValue = aTdTag.attributes.rowvalue
    const rowNewValue = aTdTag.innerText;
    // console.log(id, idName, rowName, rowOldValue, rowNewValue)
    if (String(rowOldValue).valueOf() === String(rowNewValue).valueOf()) return;
    if (!confirm(`Update value from ${rowOldValue} to ${rowNewValue}?`)) {
        aTdTag.innerText = rowOldValue;
        // console.log(aTdTag.innerText, rowOldValue)
        return;
    };
    // console.log(rowOldValue, rowNewValue)
    // console.log(id, idName, rowName, rowOldValue, rowNewValue)
    aTdTag.attributes.rowvalue = rowNewValue;

    const rzlt = await fetch("http://localhost:8090/table",
        {
            method: "put",
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({
                id: `${id}`,
                idName: `${idName}`,
                rowName: `${rowName}`,
                rowvalue: `${rowNewValue}`,
                tableName: `${pickedTableName}`
            })
        })
        .then(p => p.json())
    if (!rzlt.SCode) alert("update: " + rzlt.message)
    else { alert("Error: " + rzlt.message); aTdTag.innerText = rowOldValue; }
}

const deleteTableRow = async (e) => {
    const aTdTag = e.target.parentNode;
    const id = aTdTag.attributes.rowid;
    const idName = aTdTag.attributes.rowidname;
    if (!confirm(`Delete this row from ${pickedTableName} with id=${id}?`)) {
        return;
    };
    const rzlt = await fetch("http://localhost:8090/table",
        {
            method: "delete",
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({
                id: `${id}`,
                idName: `${idName}`,
                tableName: `${pickedTableName}`
            })
        })
        .then(p => p.json())
    if (!rzlt.SCode) {
        alert("update: " + rzlt.message)
        showTable();
    }
    else alert("Error: " + rzlt.message)
}

const getTableRowCount = async () => {
    if (pickedTableName == undefined) return;
    const dataRows = await fetch("http://localhost:8090/table/rowcount",
        {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({ tableName: `${pickedTableName}` })
        })
        .then(p => p.json())

    let rowcount = dataRows[0].rowcount
    totalPages = Math.ceil(rowcount / pageLimit)
    currPage = 0;
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

    const _offset = currPage * pageLimit;
    const dataRows = await fetch("http://localhost:8090/table",
        {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({ tableName: `${pickedTableName}`, limit: `${pageLimit}`, offset: `${_offset}` })
        })
        .then(p => p.json())
    // .catch((err) => {
    //     console.dir(err)
    // })
    // console.log(dataRows)


    let fillTable = () => {
        const tHeaderTag = document.getElementById('table-head')
        const tBodyTag = document.getElementById('table-body')
        let isMessage=false
        let fillTHead = () => {
            const aTrTag = document.createElement('tr')
            tHeaderTag.append(aTrTag)
            const delTdTag = document.createElement('td')
            aTrTag.appendChild(delTdTag)
            const aDataRow = dataRows[0]
            Object.keys(aDataRow).forEach(th => {
                const aThTag = document.createElement('th')
                aTrTag.appendChild(aThTag)
                aThTag.innerHTML = th
                if(th=="message")isMessage=true;
            })
        }
        fillTHead();
        let fillBody = () => {
            dataRows.forEach(row => {
                const aTrTag = document.createElement('tr')
                tBodyTag.append(aTrTag)
                
                const delTdTag = document.createElement('td')
                aTrTag.appendChild(delTdTag)
                delTdTag.innerHTML = isMessage?"":"<button>Delete</button>"

                const values = Object.values(row)
                const keys = Object.keys(row)
                delTdTag.attributes.rowid = values[0]
                delTdTag.attributes.rowidname = keys[0]
                delTdTag.onclick = deleteTableRow;
                Object.entries(row).forEach(([k, v]) => {
                    const aTdTag = document.createElement('td')
                    aTrTag.appendChild(aTdTag)
                    aTdTag.innerText = v
                    aTdTag.attributes.rowid = values[0]
                    aTdTag.attributes.rowidname = keys[0]
                    aTdTag.attributes.rowname = k
                    aTdTag.attributes.rowvalue = v

                    // console.log(aTdTag.attributes.rowid, aTdTag.attributes.rowname, aTdTag.attributes.rowvalue)
                    aTdTag.ondblclick = (e) => {
                        e.target.contentEditable = true;
                        // console.log("try to update1:",e.target.contentEditable)
                        e.target.contentEditable
                    }
                    aTdTag.onmouseout = (e) => {
                        // console.log("try to update2:",e.target.contentEditable)
                        if (e.target.contentEditable == "true") {
                            // console.log("try to update3:",e.target.contentEditable)
                            updateTableCell(aTdTag);
                        }
                        e.target.contentEditable = false;
                    }
                })
            })
        }
        fillBody()
    }

    fillTable();
}

function toLastPage(e) {
    if (!totalPages) return
    if (currPage == 0) return
    currPage--
    showTable();
}

function toNextPage(e) {
    if (!totalPages) return
    if (currPage === totalPages) return
    currPage++
    showTable();
}

function toggle_c_urd(e) {
    const c_urd_btn = e.target

    const urd_table = document.getElementById('table-content')
    const c_div = document.getElementById('table-insert-row')
    urd_table.classList.toggle('hidden')
    c_div.classList.toggle('hidden')
    if (c_div.classList.contains('hidden'))
        c_urd_btn.innerHTML = "Insert New Row"
    else
        c_urd_btn.innerHTML = "Show Table"
}

const addBtnEvent = () => {
    document.getElementById('btnLastPage').addEventListener('click', toLastPage)
    document.getElementById('btnNextPage').addEventListener('click', toNextPage)
    document.getElementById('select-c-urd').addEventListener('click', toggle_c_urd)
    document.getElementById('newrow-submit').addEventListener('click', AddNewRowToDB)
}
function refresh() {
    fillTableNav()
    setPickedTableName()

    getTableRowCount()
    showTable()
    prepareTableFields()
    addBtnEvent()
}

async function fetchData(url, optionsObj = { 'Content-Type': 'application/json' }, bodyContent = []) {
    const dataRows = await fetch(url,
        {
            method: "post",
            headers: optionsObj,
            body: bodyContent
        })
        .then(p => p.json())
    return dataRows
}
async function prepareTableFields() {
    if (!pickedTableName) return
    const url = 'http://localhost:8090/table/colinfo'
    const optionsObj = {
        'Content-Type': 'application/json'
    }
    const bodyContent = JSON.stringify({ tableName: `${pickedTableName}` })
    const columnsInfo = await fetchData(url, optionsObj, bodyContent)

    const colFieldsTag = document.getElementById('col-fields')
    // console.dir(columnsInfo)
    while (colFieldsTag.firstChild) colFieldsTag.removeChild(colFieldsTag.firstChild)
    Array.from(columnsInfo).splice(1).forEach(c => {
        const aDiv = document.createElement('div')
        colFieldsTag.appendChild(aDiv)
        aDiv.classList.add('col-field')
        const aLable = document.createElement('label')
        aDiv.appendChild(aLable)
        aLable.innerText = c.name
        aLable.for = c.name
        aLable.classList.add('label-field')
        const aInput = document.createElement('input')
        aDiv.appendChild(aInput)
        aInput.placeholder = "Input..."
        aInput.name = c.name
        aInput.required = true
        aInput.classList.add('input-field')
    })


}

function resetInput(){
    const inputTags = document.querySelectorAll('#col-fields input')
    Array.from(inputTags).forEach(p => {
        p.value=""
    })
}

function AddNewRowToDB(e) {
    e.preventDefault()
    const colNames = []
    const colValues = []
    const inputTags = document.querySelectorAll('#col-fields input')
    // console.dir(inputTags)
    let is_NotNull = true
    Array.from(inputTags).forEach(p => {
        // console.dir(p)
        // console.dir(p.name)
        // console.dir(p.value)
        colNames.push(p.name)
        colValues.push(p.value)
        if (p.value == "") {
            alert(`Field ${p.name} cannot be Null!`)
            is_NotNull = false
        }
    })
    if (!is_NotNull) return
    let addNewRow = async () => {
        const rzlt = await fetch("http://localhost:8090/table/addNewRow",
            {
                method: "post",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    colNames, colValues,tableName:pickedTableName
                })
            })
            .then(p => p.json())
        if (!rzlt.SCode) {resetInput();alert("New Row added: " + rzlt.message)}
        else { alert("Error: " + rzlt.message); }
    }
    addNewRow();
    refresh();
}
refresh();


