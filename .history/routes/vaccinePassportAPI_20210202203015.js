
const upload = multer()
var fs = require('fs');

router.post('/patientRegistration', async (req, res) => {
    console.log("in patient registration")
    var name = req.query.name
    var address = req.query.address
    var dob = req.query.dob
    var blood_group = req.query.blood_group
    var vaccine_name = req.query.vaccine_name
    var vaccine_type = req.query.vaccine_type
    var company = req.query.company
    var date_of_vaccine = req.query.date_of_vaccine
    var dose_no = req.query.dose_no
    var national_id = req.query.national_id
   
  
    var output = {}
  
    let errors = false;
    if (name.length === 0 || address.length === 0 || dob.length === 0 || blood_group.length === 0) {
      errors = true;
      output["status"] = false
      res.send(output)
      return
  
    }
    const patientDets = {
        name: name,
        address: address,
        dob: dob,
        blood_group: blood_group,
        vaccine_name: vaccine_name,
        vaccine_type: vaccine_type,
        company: company,
        date_of_vaccine: date_of_vaccine,
        done_no: dose_no
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