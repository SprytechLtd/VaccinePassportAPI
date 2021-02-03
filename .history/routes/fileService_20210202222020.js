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


module.exports = {
    encodeFileToBase64 : async function(file) {
        let fileId = "";
        try {
            //console.log(file);
            const base64 = file.buffer.toString('base64')
            const formattedBase64 =  "data:" + file.mimetype + ";base64," + base64
            return base64
            
        } catch (error) {
            console.log('error at uploadFile method')
            console.log(err.message);
             return {};
        }
    }
}