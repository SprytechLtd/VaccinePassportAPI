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
    encodeFileToBase64: async function (file) {
        let base64;
        try {
            //console.log(file);
            base64 = file.buffer.toString('base64')
            const formattedBase64 = "data:" + file.mimetype + ";base64," + base64
            return base64

        } catch (error) {
            console.log('error at uploadFile method')
            console.log(err.message);
            return {};
        }
    },
    fileUpdate: async function (fileData, fileId) {
        const privateKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);
        const client = HederaClient;
        //let fileId = "";
        const fileChunk = 4000;
        const largeFile = fileData.length > fileChunk;
        let startIndex = 0;
        try {
            const keys = [];
            keys.push(privateKey);
            const fileCreateTransaction = new FileUpdateTransaction()
                .setFileId(FileId.fromString(fileId))
                .setKeys(keys);
            if (largeFile) {
                // if we have a large file (> 4000 bytes), create the file with keys
                // then run file append
                // then remove keys
                fileCreateTransaction.setContents(fileData.slice(0, fileChunk));
                //fileCreateTransaction.setKeys(keys);
            } else {
                fileCreateTransaction.setContents(fileData);
            }

            console.log('234')
            let response = await fileCreateTransaction
                .setMaxTransactionFee(Hbar.from(10))
                .execute(client);
            console.log('238')
            let transactionReceipt = await response.getReceipt(client);

            if (transactionReceipt.status !== Status.Success) {
                console.log(transactionReceipt.status.toString());
                return "";
            }

            fileId = transactionReceipt.fileId.toString();

            const transaction = {
                id: response.transactionId.toString(),
                type: "fileCreate",
                inputs: fileData.substr(0, 20),
                outputs: "fileId=" + fileId
            };

            startIndex = startIndex + fileChunk;
            let chunks = 1;
            while (startIndex <= fileData.length) {
                console.log("Saving token properties file chunk " + chunks);
                chunks += 1;
                // sleep 500ms to avoid duplicate tx errors
                await new Promise(r => setTimeout(r, 500));
                // append to file
                response = await new FileAppendTransaction()
                    .setContents(fileData.slice(startIndex, startIndex + fileChunk))
                    .setFileId(FileId.fromString(fileId))
                    .setMaxTransactionFee(Hbar.from(10))
                    .execute(client);
                let transactionReceipt = await response.getReceipt(client);

                if (transactionReceipt.status !== Status.Success) {
                    console.log(transactionReceipt.status.toString());
                    return "";
                }
                startIndex = startIndex + fileChunk;
            }

            // EventBus.$emit("addTransaction", transaction);

            if (largeFile) {
                // remove keys
                console.log('its here 159')
                response = await new FileUpdateTransaction()

                    .setFileId(FileId.fromString(fileId))
                    .execute(client);
                transactionReceipt = await response.getReceipt(client);

                if (transactionReceipt.status !== Status.Success) {
                    console.log(transactionReceipt.status.toString());
                    return "";
                }

                // notifySuccess("Token properties file created");
            }
        } catch (err) {
            //notifyError(err.message);
            console.log('its here')
            console.error(err);

            return "";
        }
        return fileId;
    }
}