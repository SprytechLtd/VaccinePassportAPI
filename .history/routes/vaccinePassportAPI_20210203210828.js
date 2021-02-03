
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
        // if (req.file) {
        //     try {
        //         const base64 = await fileServiceModule.encodeFileToBase64(req.file)
        //         fileId = await fileServiceModule.fileCreate(JSON.stringify(base64));
        //     } catch (err) {
        //         console.log('error in upload', err)
        //     }
        // }
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


        //const patientFile = await fileServiceModule.convertToJSONFile(patientDets);
        // console.log(patientFile)
        // let patientFilePath = path.join(__dirname,'/jsonFiles/','file.json');
        let patientFileId;
        //const getStream = require(path.join(__dirname,'/jsonFiles/','file.json'))
        //console.log("getStream",getStream)
        // let patientFile = fileServiceModule.loadJsonFile(patientFilePath);
        //console.log("patientFile",patientFile);
        
        // create file service for patient details
        if (patientDets) {
            try {
                //const base64 = await fileServiceModule.encodeFileToBase64(fileData)
                //patientFileId = await fileServiceModule.fileUpdate(JSON.stringify(jsonBase64), patientFileId);
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
        // patientFileId = "";
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

            const newToken = await tokenServiceModule.tokenCreate(token);
            const saveToken = sqlServices.hederaClientLocal(newToken, id);
            res.send(newToken);
            console.log('newToken', newToken)



        }
    } catch (error) {
        console.log(error);
        res.json({ "status": false });
    }
});


module.exports = router;