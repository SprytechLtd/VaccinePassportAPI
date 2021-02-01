const mysql = require("mysql");

// var mysqlConnection = mysql.createConnection({
//     host : "test.cqyfksx8uik6.eu-west-1.rds.amazonaws.com",
//     user : "admin",
//     password: "zsXrIwCYy0%b",
//     database: "test",
//     multipleStatements : true
// });

// mysqlConnection.connect((err) => {
//     if(!err){

//         console.log("connected")
//     }else{
//         console.log(err)
//         console.log("Not connected")
//     }
// })
//var mysql = require('mysql');
var mysqlConnection  = mysql.createPool({
  connectionLimit : 10,
  host            : 'test.cqyfksx8uik6.eu-west-1.rds.amazonaws.com',
  user            : 'admin',
  password        : 'zsXrIwCYy0%b',
  database        : 'test'
});

mysqlConnection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});
module.exports = mysqlConnection