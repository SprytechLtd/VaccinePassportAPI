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

        var output = {}
        let errors = false;
        // if (mobile.length === 0 || username.length === 0 || email.length === 0 || email.password === 0) {
        //     errors = true;
        //     output["status"] = false
        //     res.send(output)
        //     return

        // }
        console.log('id===>',id)
        if (!errors) {

            var form_data = {
                token_id: tokenId,
                token_PK: token_private_key,
                token_PB: token_public_key,
                national_file_id: fileId,
                patient_file_id: patientId
            }

            // insert query
            try {
                mysqlConnection.query('UPDATE passport_users SET ? WHERE id= ? ', [form_data,id], function (err, result) {
                    //if(err) throw err
                    console.log("error", err)
                    if (err) {
                        output["status"] = false
                    } else {
                         output["status"] = true
                        console.log('updated table')
                     
    
                    }
                })
            } catch (error) {
                
            }
            
        }
    }
}