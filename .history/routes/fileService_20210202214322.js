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
    uploadFile:async function(token) {
        let fileId
        try {
            
        } catch (error) {
            console.log('error at uploadFile method')
            console.log(err.message);
             return {};
        }
    }
}