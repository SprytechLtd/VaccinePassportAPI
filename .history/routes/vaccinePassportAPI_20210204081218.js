
const multer = require('multer');
const upload = multer()
var fs = require('fs');
const fileServiceModule = require('./fileService')
const tokenServiceModule = require('./tokenService')
const sqlServices = require('./sqlServices')
const router = require('express').Router();
const HederaClient = require('./hedera-client');
var path = require('path');

const {
    PrivateKey
} = require("@hashgraph/sdk");

//This api call is to register the patient details to the blockchain.
//A new patients id proof will be save to file service and return national_id.
//This fileid will be added to the patient details json object and store in file service, which returns patientsFileId
//This file service is added to the token's symbol and new token is created.
//this new token is used for the future reference.

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
        var id = req.query.id
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
        //create file service in hedera for nation_id
        if (req.file) {
            try {
                const base64 = await fileServiceModule.encodeFileToBase64(req.file)
                fileId = await fileServiceModule.fileCreate(JSON.stringify(base64));
            } catch (err) {
                console.log('error in upload', err)
            }
        }
        console.log('fileId', fileId)
        
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

        let patientFileId;
        // create file service for patient details
        if (patientDets) {
            try {
                var jsonBase64 = new Buffer.from(JSON.stringify(patientDets)).toString("base64");
                console.log('jsonBase64', jsonBase64)
                patientFileId = await fileServiceModule.fileCreate(JSON.stringify(jsonBase64));
            } catch (err) {
                console.log('error in upload', err)
            }
        }
        console.log('after patientFile')
        console.log('patientFileId', patientFileId)
        const privateKey = await PrivateKey.generate();
        const tokenName = vaccine_name
        const isKyc = ""
        let message = "msg:" + patientFileId;
        console.log('patientFileId', patientFileId)
        
        //building token details
        if (patientFileId != "") {
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
                message: patientFileId !== "" ? message : ""
            };
            
            //create token with patient details
            const newToken = await tokenServiceModule.tokenCreate(token);
            if (newToken.status == true) {
                const response = {
                    status: newToken.status,
                    tokenId: newToken.tokenId,
                    token_private_key: newToken.token_private_key,
                    token_public_key: newToken.token_public_key,
                    fileId: fileId,
                    patientFileId: patientFileId

                };
                const saveToken = sqlServices.hederaClientLocal(response, id);
                res.send(response);
                console.log('newToken', response)
            }



        }
    } catch (error) {
        console.log(error);
        res.json({ "status": false });
    }
});

router.route('/getTokenInfo').post(async (req, res) => {

    const token = {}
    token.tokenId = req.query.tokenId
   const info = await tokenServiceModule.tokenGetInfo(token)
   res.json(info)
    
})
module.exports = router;