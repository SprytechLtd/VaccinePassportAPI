const mysqlConnection = require("../connection")
var async = require('async');
const mysql = require("mysql");

function (operatorAccount, operatorPrivateKey) {
    if (!this.checkProvided(process.env.HEDERA_NETWORK)) {
        throw new Error("HEDERA_NETWORK must be set in environment");
    }

    let client;
    switch (process.env.HEDERA_NETWORK.toUpperCase()) {
        case "TESTNET":
            client = Client.forTestnet();
            break;
        case "MAINNET":
            client = Client.forMainnet();
            break;
        default:
            throw new Error('VUE_APP_NETWORK must be "testnet" or "mainnet"');
    }
    client.setOperator(operatorAccount, operatorPrivateKey);
    return client;
}