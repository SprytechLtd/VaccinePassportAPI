router.post('/patientRegistration', async (req, res) => {
    console.log("in patient registration")
    var name = req.query.name
    var address = req.query.address
    var dob = req.query.dob
    var blood_group = req.query.blood_group
    var address = req.query.address
    var dob = req.query.dob
    var blood_group = req.query.blood_group
  
    var output = {}
  
    let errors = false;
    if (mobile.length === 0 || username.length === 0 || email.length === 0 || email.password === 0) {
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
  
  });