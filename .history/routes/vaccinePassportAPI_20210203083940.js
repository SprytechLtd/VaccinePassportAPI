
const multer = require('multer');
const upload = multer()
var fs = require('fs');
const fileServiceModule = require('./fileService')
const tokenServiceModule = require('./tokenService')
const router = require('express').Router();
const HederaClient = require('./hedera-client');

const {
    PrivateKey
  } = require("@hashgraph/sdk");

router.post('/patientRegistration', upload.single('national_id'), async (req, res) => {
    console.log("in patient registration")
    try {
        var name = req.query.name
        var address = req.query.address
        var dob = req.query.dob
        var blood_group = req.query.blood_group
        var vaccine_name = req.query.vaccine_name
        var vaccine_type = req.query.vaccine_type
        var company = req.query.company
        var date_of_vaccine = req.query.date_of_vaccine
        var dose_no = req.query.dose_no
        //var national_id = req.query.national_id


        var output = {}

        let errors = false;
        if (name.length === 0 || address.length === 0 || dob.length === 0 || blood_group.length === 0) {
            errors = true;
            output["status"] = false
            res.send(output)
            return

        }
        let fileId = "";
        if(req.file) {
            try{
              const base64 = await fileServiceModule.encodeFileToBase64(req.file)
              fileId = await fileServiceModule.fileUpdate(JSON.stringify(base64), fileId);
            }catch(err){
              console.log('error in upload',err)
            }
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
            done_no: dose_no,
            fileId: fileId != "" ? fileId : ""
        }

         fileServiceModule.convertToJSONFile(patientDets);

        let patientFileId = "";
        // if(patientFile) {
        //     try{
        //       const base64 = await fileServiceModule.encodeFileToBase64(patientFile)
        //       patientFileId = await fileServiceModule.fileUpdate(JSON.stringify(base64), patientFileId);
        //     }catch(err){
        //       console.log('error in upload',err)
        //     }
        //   }
        const privateKey = await PrivateKey.generate();
        const tokenName = vaccine_name
        const isKyc = ""
        let message = "msg:" + patientFileId;
        if (patientFileId !== "") {
            const treasury_account_id = process.env.TREASURY_ACCOUNT_ID;
            const token = {
                name: tokenName,
                symbol: patientFileId !== "" ? message : undefined,
                decimals: 0,
                initialSupply: 1,
                adminKey: undefined,
                kycKey: isKyc !== "" ? privateKey.toString() : undefined,
                freezeKey: undefined,
                wipeKey: undefined,
                supplyKey: undefined,
                defaultFreezeStatus: undefined,
                autoRenewAccount: treasury_account_id,
                treasury: treasury_account_id,
                deleted: false,
                key: privateKey.toString(),
                message: patientFileId !== "" ? message : undefined
            };

            console.log("token private key" + privateKey.toString());
            const newToken = await tokenServiceModule.tokenCreate(token);
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
        }
    } catch (error) {
        console.log(error);
        res.json({ "error": error });
    }
});


module.exports = router;