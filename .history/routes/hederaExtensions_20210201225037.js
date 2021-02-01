const router = require('express').Router();
const HederaClient = require('./hedera-client');
const { Client, Ed25519PrivateKey, AccountCreateTransaction, AccountBalanceQuery ,PrivateKey, Hbar} = require("@hashgraph/sdk");





const mysqlConnection = require("../connection")
var async = require('async');
const mysql = require("mysql");


router.get('/createAccount', async (req, res) => {
console.log("in account create")
  var mobile = req.query.mobile
  var username = req.query.username
  var email = req.query.email
  var password = req.query.password

  var output = {}
    
  let errors = false;
  if(mobile.length === 0 || username.length === 0 || email.length === 0  || email.password === 0 ) {
        errors = true;
        output["status"] = false
        res.send(output)
        return
       
    }
    

    
    const newAccountPrivateKey = await PrivateKey.generate(); 
    const newAccountPublicKey = newAccountPrivateKey.publicKey; 


    const response = await new AccountCreateTransaction()
      .setKey(newAccountPrivateKey.publicKey)
      .setMaxTransactionFee(new Hbar(50))
      .setInitialBalance(new Hbar(50))
      .execute(HederaClient);

    const transactionReceipt = await response.getReceipt(HederaClient);
    const newAccountId = transactionReceipt.accountId;

    console.log("The new account ID is: " +newAccountId);



    if(!errors){

      var form_data = {
        name: username,
        email: email,
        mobile: mobile,
        privateKey : newAccountPublicKey,
        publicKey : newAccountPrivateKey,
        accountId : newAccountId.toString(),
        password : password
      }

        // insert query
        mysqlConnection.query('INSERT INTO passport_users SET ?', form_data, function(err, result) {
          //if(err) throw err
          console.log("error", err)
          if (err) {
            
            output["status"] = false
            res.send(output)
          } else {

              
            output["status"] = true
            output["user_id"] = result.insertId
            output["account"] =  newAccountId.toString()
            res.send(output)
             


          }
      })


    }


    
  });


  router.get("/getAccount", async (req, res) =>{

   // var mobile = req.query.mobile
    var email = req.query.email
    var password = req.query.password
    
    //var phone = req.query.b

   /// console.log(username)
   // console.log(phone)

    var jsonArr = []
    const promises = []

    var bigOutput = {}
    var output = [];
    var sql = ""
    if(email && password){
        sql = mysql.format("select * from passport_users where email=? && password=?",[mobile, email])
    }else{

    }

    mysqlConnection.query(sql ,function(error,results,filelds){
      if(error) {
          console.log(error)
          var json = {}
          json['status'] = false
          res.send(json)
      }else{

        if(results.length > 0){
          var json = {}
        json['status'] = true
        json['account'] =  results[0].h_account_id
        json['publicKey'] =  results[0].public_key
        json['privateKey'] =  results[0].private_key
        res.send(json)
     }else{
      var json = {}
      json['status'] = false
      res.send(json)
     }
        

      }
    });
    

});

  module.exports = router;