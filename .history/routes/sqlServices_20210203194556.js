const mysqlConnection = require("../connection")
var async = require('async');
const mysql = require("mysql");

module.exports = {
    hederaClientLocal: function (tokenDets) {
        console.log("in account create")
        var mobile = tokenDets.tokenId
        var username = req.query.username
        var email = req.query.email
        var password = req.query.password

        var output = {}

        let errors = false;
        if (mobile.length === 0 || username.length === 0 || email.length === 0 || email.password === 0) {
            errors = true;
            output["status"] = false
            res.send(output)
            return

        }

        console.log("The new account ID is: " + newAccountId);



        if (!errors) {

            var form_data = {
                name: username,
                email: email,
                mobile: mobile,
                publicKey: newAccountPublicKey.toString(),
                privateKey: newAccountPrivateKey.toString(),
                accountId: newAccountId.toString(),
                password: password
            }

            // insert query
            mysqlConnection.query('INSERT INTO passport_users SET ?', form_data, function (err, result) {
                //if(err) throw err
                console.log("error", err)
                if (err) {

                    output["status"] = false
                    res.send(output)
                } else {

                    output["status"] = true
                    output["id"] = result.insertId
                    output["name"] = username
                    output["email"] = email
                    output["mobile"] = mobile
                    output['hederaAccount'] = { "accountId": newAccountId.toString(), "privateKey": newAccountPrivateKey.toString(), "publicKey": newAccountPublicKey.toString() }
                    console
                    res.send(output)


                }
            })
        }
    }