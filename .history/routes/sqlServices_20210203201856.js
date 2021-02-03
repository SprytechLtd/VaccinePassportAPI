const mysqlConnection = require("../connection")
var async = require('async');
const mysql = require("mysql");

module.exports = {
    hederaClientLocal: function (tokenDets,id) {
        console.log("in account create")
        var tokenId = tokenDets.tokenId
        var token_private_key = tokenDets.token_private_key
        var token_public_key = tokenDets.token_public_key
        var fileId = tokenDets.fileId
        var patientId = tokenDets.patientId


        let errors = false;
        // if (mobile.length === 0 || username.length === 0 || email.length === 0 || email.password === 0) {
        //     errors = true;
        //     output["status"] = false
        //     res.send(output)
        //     return

        // }

        if (!errors) {

            var form_data = {
                tokenId: tokenId,
                token_private_key: token_private_key,
                token_public_key: token_public_key,
                fileId: fileId,
                patientId: patientId
            }

            // insert query
            mysqlConnection.query('UPDATE passport_users SET ? WHERE ? ', [form_data,id], function (err, result) {
                //if(err) throw err
                console.log("error", err)
                if (err) {

                    output["status"] = false
                    res.send(output)
                } else {

                    output["status"] = true
                    console
                    res.send(output)


                }
            })
        }
    }
}