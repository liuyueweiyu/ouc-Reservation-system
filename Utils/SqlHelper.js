const getCon = require('./ConHelper');
const verify = require('../config/verify.config.js');
function insertItems(table,obj) {
    let addSqlParams=[],list=[],addSqlArgs = [],question,number = 0;
    for (const i in obj) {
        addSqlArgs.push(i);
        list.push(obj[i].split(','));
        number++;
    }
    return new Promise((resolve, reject) => {
        const addSql = `INSERT INTO ${table}(${addSqlArgs.join(',')}) VALUES ?`,
              con = getCon(insertItems, table, obj);
        for (let i = 0, len = list[0].length; i < len; i++) {
            addSqlParams[i] = [];
            for (let j = 0; j < number; j++) {
                addSqlParams[i][j] = list[j][i];
            }
            const msg = verify[table].test(addSqlArgs, addSqlParams[i]);
            if (msg !== undefined) {
                reject({
                    code: 2,
                    msg
                });
                return;
            }
        }
        con.query(addSql, [addSqlParams], function (err, data) {
            con.end();
            if (err) reject(err);
            else resolve(data);
        });
    })
}

function insertItem(table,obj) {
    let addSqlParams = [],addSqlArgs = [],question;
    for (const i in obj) {
        addSqlArgs.push(i);
        addSqlParams.push(obj[i]);
    }
    question = (new Array(addSqlArgs.length)).fill('?').join(',');
    const addSql = `INSERT INTO ${table}(${addSqlArgs.join(',')}) VALUES(${question})`,
          con = getCon(insertItem,table,obj);
    return new Promise((resolve, reject) => {
        const msg = verify[table].test(addSqlArgs, addSqlParams);
        if(msg){
            reject({code:2,msg});
            return;
        }
        con.query(addSql, addSqlParams, function (err, data) {
            con.end();
            if (err) reject(err);
            else resolve(data);
        });
    })
    
    
}
function updateItemByFilter(table, obj, filter) {
    let modSqlParams = [],modSqlArgs = [],modSqlArgss=[];
    for (const i in obj) {
        modSqlArgss.push(i);
        modSqlArgs.push(i + ' = ' + obj[i]);
        modSqlParams.push(obj[i]);
    }
    const modSql = `UPDATE ${table} SET ${modSqlArgs.join(',')} ${filter}`,
          con = getCon(updateItemByFilter, table,obj,filter);
    return new Promise((resolve, reject) => {
        const msg = verify[table].test(modSqlArgss, modSqlParams);
        if(msg){
            reject({code:2,msg});
            return;
        }
        con.query(modSql, function (err, data) {
            con.end();
            if (err) reject(err);
            else resolve(data);
        });
    })
}

function updateItem(table,obj,id,filter) {
    let modSqlParams = [],modSqlArgs = [],question,modSqlArgss=[];
    for (const i in obj) {
        modSqlArgss.push(i);
        modSqlArgs.push(i + ' = ?');
        modSqlParams.push(obj[i]);
    }
    question = (new Array(modSqlArgs.length)).fill('?').join(',');
    const modSql = `UPDATE ${table} SET ${modSqlArgs.join(',')}  ${filter == undefined ? 'WHERE id = ?' : filter};`,
          con = getCon(updateItem, table, obj,id);
    if (filter == undefined)
        modSqlParams.push(id);
    return new Promise((resolve, reject) => {
        const msg = verify[table].test(modSqlArgss, modSqlParams);
        if(msg){
            reject({code:2,msg});
            return;
        }
        con.query(modSql, modSqlParams, function (err, data) {
            con.end();
            if (err) reject(err);
            else resolve(data);
        });
    })
}
function deleteItem(table,id) {
    const delSql = `DELETE FROM ${table} where id=${id}`,
          con = getCon(deleteItem, table, id);
    return new Promise((resolve, reject) => {
        con.query(delSql, function (err, data) {
            con.end();
            console.log(err)
            if (err) reject(err);
            else resolve(data);
        });
    })
}

function deleteItems(table,ids) {
    const delSql = `DELETE FROM ${table} where id in (${ids})`,
          con = getCon(deleteItems, table, ids);
    return new Promise((resolve, reject) => {
        if (ids == '' || !/^[0-9,]*$/.test(ids)) {
            reject({code: 2,msg: '错误参数!'})
            return;
        }
        con.query(delSql, function (err, data) {
            con.end();
            if (err) reject(err);
            else resolve(data);
        });
    })
}

function selectTableCount(table,filter) {
    const sql = `SELECT COUNT(id) FROM ${table} ${filter === undefined?'':filter};`,
          con = getCon(selectTableCount,table,filter)
    return new Promise((resolve, reject) => {
        con.query(sql, function (err, data) {
            con.end();
            if (err) reject(err);
            else resolve(data[0]['COUNT(id)']);
        });
    })
}
/**
 *
 *
 * @param {string} table
 * @param {string} filter 不需要时,填undefined
 * @param {Array} props
 * @returns 
 */
function selectTableItem(table, filter ,props) {
    const sql = `SELECT ${props === undefined || props.length === 0 ? '*':props.join()} FROM ${table} ${filter === undefined ?'':filter}`,
        con = getCon(selectTableItem, table, filter,props)
    return new Promise((resolve, reject) => {
        con.query(sql, function (err, data) {
            con.end();
            if (err) reject(err);
            else resolve(data);
        });
    })
}
function selectTableItemFromTwoTable(tables, filter, props){
   const sql = `SELECT ${props.join()} FROM ${tables.join()} ${filter}  ;`
          con = getCon(selectTableItemFromTwoTable, tables, filter, props);
    return new Promise((resolve, reject) => {
        con.query(sql, function (err, data) {
            con.end();
            if (err) reject(err);
            else resolve(data);
        });
    })
}
module.exports = {
    insertItem,
    insertItems,
    updateItem,
    updateItemByFilter,
    deleteItem,
    deleteItems,
    selectTableCount,
    selectTableItem,
    selectTableItemFromTwoTable,
}