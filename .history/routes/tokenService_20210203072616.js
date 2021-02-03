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
  Status
} = require("@hashgraph/sdk");

function ownerClient() {
  return hederaClientForUser("Owner");
}