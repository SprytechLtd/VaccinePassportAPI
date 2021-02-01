const mysql = require("mysql");
var mysqlConnection = mysql.createConnection({
    host : "localhost",
    user : "root",
    password: "10148710",
    database: "hederadb",
    multipleStatements : true
});

mysqlConnection.connect((err) => {
    if(!err){

        console.log("connected")
    }else{

        console.log("Not connected")
    }
})

module.exports = mysqlConnection