require('dotenv').config();
const { Client } = require('@hashgraph/sdk');

const myAccountId = process.env.MY_ACCOUNT_ID;
const myPrivateKey = process.env.MY_PRIVATE_KEY;

//If we weren't able to grab it, we should throw a new error
if (myAccountId == null ||
    myPrivateKey == null ) {
    throw new Error("Environment variables myAccountId and myPrivateKey must be present");
}

hederaClientLocal: function (operatorAccount, operatorPrivateKey) {
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
const HederaClient = Client.forTestnet();
HederaClient.setOperator(myAccountId, myPrivateKey);
module.exports = HederaClient;