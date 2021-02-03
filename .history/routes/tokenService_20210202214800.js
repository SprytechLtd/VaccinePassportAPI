const { Client, PrivateKey, AccountCreateTransaction, AccountBalanceQuery, TokenCreateTransaction, Hbar, AccountInfoQuery, TokenMintTransaction, TokenAssociateTransaction, TransferTransaction } = require("@hashgraph/sdk");
const {
    FileContentsQuery,
    FileCreateTransaction,
    FileUpdateTransaction,
    FileAppendTransaction,
    FileDeleteTransaction,
    TokenInfoQuery,
    FileInfoQuery,
    FileId,
    Status
  } = require("@hashgraph/sdk");
const router = require('express').Router();
const HederaClient = require('./hedera-client');
const multer = require('multer');
const upload = multer()
var fs = require('fs');
var buffer = require('buffer');
var path = require('path');
const getStream = require('get-stream')
const tokenCreateModule = require('./fileService')


router.post('/patientRegistration', upload.single('document'), async function (req, res) {
    if(req.file) {
      try{
        const base64 = await encodeFileToBase64(req.file)
        const fileId = await fileCreate(JSON.stringify(base64));
        res.json(fileId);
      }catch(err){
        console.log('error in upload',err)
      }
    }
    else throw 'error';
});