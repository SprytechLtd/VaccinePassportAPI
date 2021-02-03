const HederaClient = require('./hedera-client');

const {
  PrivateKey,
  TokenCreateTransaction,
  TokenAssociateTransaction,
  TokenBurnTransaction,
  TokenDeleteTransaction,
  TokenDissociateTransaction,
  TokenFreezeTransaction,
  TokenGrantKycTransaction,
  TokenInfoQuery,
  TokenMintTransaction,
  TokenRevokeKycTransaction,
  TransferTransaction,
  TokenUnfreezeTransaction,
  TokenWipeTransaction,
  Hbar,
  Status,
  Client
} = require("@hashgraph/sdk");

function ownerClient() {
  return hederaClientForUser("Owner");
}

module.exports = {
    tokenCreate : async function (token){
        let transaction;
        console.log("in token create method");
        console.log("token" + token);
        const autoRenewPeriod = 7776000; // set to default 3 months
       
        try {
            let additionalSig = false;
            let sigKey;
            const tx = await new TokenCreateTransaction();
            tx.setTokenName(token.name);
            tx.setTokenSymbol(token.symbol.toUpperCase());
            tx.setDecimals(token.decimals);
            tx.setInitialSupply(token.initialSupply);
            tx.setTreasuryAccountId(token.treasury);
            tx.setAutoRenewAccountId(token.autoRenewAccount);
            tx.setMaxTransactionFee(new Hbar(100));
            tx.setAutoRenewPeriod(autoRenewPeriod);
            console.log('token.message',token.message)
            if(token.memo){
             tx.setTransactionMemo(token.message);
            }
            
            if (token.adminKey) {
                console.log("token.adminKey=" + token.adminKey);
                sigKey = PrivateKey.fromString(token.key);
                tx.setAdminKey(sigKey.publicKey);
                additionalSig = true;
            }
            // alert("token.kycKey = " + token.kycKey);
            if (token.kycKey) {
                console.log("token.kycKey=" + token.kycKey);
                sigKey = PrivateKey.fromString(token.key);
                tx.setKycKey(sigKey.publicKey);
                additionalSig = true;
            }
            // alert("token.freezeKey = " + token.freezeKey);
            if (token.freezeKey) {
                console.log("token.freezeKey=" + token.freezeKey);
                sigKey = PrivateKey.fromString(token.key);
                tx.setFreezeKey(sigKey.publicKey);
                additionalSig = true;
                tx.setFreezeDefault(token.defaultFreezeStatus);
            } else {
                tx.setFreezeDefault(false);
            }
            // alert("token.wipeKey = " + token.wipeKey);
            if (token.wipeKey) {
                console.log("token.wipeKey=" + token.wipeKey);
                additionalSig = true;
                sigKey = PrivateKey.fromString(token.key);
                tx.setWipeKey(sigKey.publicKey);
            }
            // alert("token.supplyKey = " + token.supplyKey);
            if (token.supplyKey) {
                console.log("token.supplyKey=" + token.supplyKey);
                additionalSig = true;
                sigKey = PrivateKey.fromString(token.key);
                tx.setSupplyKey(sigKey.publicKey);
            }
            sigKey = PrivateKey.fromString(token.key);
            const client = this.hederaClientLocal(process.env.TREASURY_ACCOUNT_ID, process.env.TREASURY_PRIVATE_KEY);
            console.log("client=" + client);
            await tx.signWithOperator(client);
    
            if (additionalSig) {
                // TODO: should sign with every key (check docs)
                // since the admin/kyc/... keys are all the same, a single sig is sufficient
                await tx.sign(sigKey);
                console.log("sigKey=" + sigKey);
            }
            // alert("additionalSig = " + additionalSig);
            const response = await tx.execute(client);
            console.log("response=", response);
            const transactionId = response.transactionId;
            console.log("transactionId",transactionId)
            const transactionReceipt = await response.getReceipt(client);
            //console.log("transactionReceipt="+transactionReceipt);
            console.log(transactionReceipt.status.toString());
            console.log("token.tokenId=" + token.tokenId);
            console.log("response.transactionId.toString()=" + response.transactionId.toString());
            console.log("token_private_key=" + token.key);
            console.log("token_public_key=" + sigKey.publicKey);
            //  console.log("token.tokenId.toString()="+token.tokenId.toString());
            // alert("transactionReceipt= " + transactionReceipt);
            console.log("before if");
            {
                console.log("in else");
                token.tokenId = transactionReceipt.tokenId;
                console.log(transactionReceipt.status.toString());
                console.log("token.tokenId=" + token.tokenId);
                console.log("response.transactionId.toString()=" + response.transactionId.toString());
                sigKey = PrivateKey.fromString(token.key);
                console.log("token_private_key=" + token.key);
                console.log("token_public_key=" + sigKey.publicKey);
                 transaction = {
                    status: true,
                    id: response.transactionId.toString(),
                    type: "tokenCreate",
                    inputs:
                        "Name=" +
                        token.name +
                        ", Symbol=" +
                        token.symbol.toUpperCase() +
                        ", Decimals=" +
                        token.decimals +
                        ", Supply=" +
                        token.initialSupply +
                        ", memo=" +
                        token.message,
                    outputs: "tokenId=" + token.tokenId.toString()+","+
                    "token_private_key=" + token.key+","+
                    "token_public_key=" + sigKey.publicKey,
                    tokenId: token.tokenId.toString(),
                    token_private_key: token.key,
                    token_public_key: sigKey.publicKey.toString

                };
    
                console.log("before token info",transaction)
   
            }
            return transaction;
        } catch (err) {
            return err;
        }
    },
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
    },
    checkProvided : function (environmentVariable) {
        if (environmentVariable === null) {
            return false;
        }
        if (typeof environmentVariable === "undefined") {
            return false;
        }
        return true;
    }
}