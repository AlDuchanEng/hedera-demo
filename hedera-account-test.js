import * as dotenv from "dotenv";
dotenv.config();

import {
  Client,
  AccountBalanceQuery,
  TransferTransaction,
  Hbar,
  PrivateKey,
} from "@hashgraph/sdk";

const { OPERATOR_ID, OPERATOR_KEY, NETWORK } = process.env;
if (!OPERATOR_ID || !OPERATOR_KEY) throw new Error("Check your .env!");

console.log(`Testing account: ${OPERATOR_ID} on ${NETWORK}`);

const client =
  NETWORK === "mainnet"
    ? Client.forMainnet()
    : NETWORK === "previewnet"
    ? Client.forPreviewnet()
    : Client.forTestnet();

// Try different key formats
let privateKey;
try {
  privateKey = PrivateKey.fromStringED25519(OPERATOR_KEY);
  console.log("✅ Using ED25519 key format");
} catch (error) {
  try {
    privateKey = PrivateKey.fromStringECDSA(OPERATOR_KEY);
    console.log("✅ Using ECDSA key format");
  } catch (error2) {
    console.log("✅ Using raw string format");
    privateKey = PrivateKey.fromString(OPERATOR_KEY);
  }
}

client.setOperator(OPERATOR_ID, privateKey);

console.log("🔍 Checking account balance...");
// 1️⃣ balance
const bal = await new AccountBalanceQuery()
  .setAccountId(OPERATOR_ID)
  .execute(client);
console.log(`💰 Balance: ${bal.hbars.toString()}`);

// 2️⃣ self-transfer with timeout
console.log("💸 Attempting self-transfer of 0.01 HBAR...");
try {
  const transferTx = new TransferTransaction()
    .addHbarTransfer(OPERATOR_ID, new Hbar(-0.01))
    .addHbarTransfer(OPERATOR_ID, new Hbar(0.01))
    .setMaxTransactionFee(new Hbar(2));

  console.log("📝 Transaction created, executing...");
  
  const txResponse = await transferTx.execute(client);
  console.log(`📋 Transaction ID: ${txResponse.transactionId.toString()}`);
  
  console.log("⏳ Waiting for receipt...");
  const receipt = await txResponse.getReceipt(client);
  
  console.log("✅ Transaction successful!");
  console.log(`📊 Status: ${receipt.status.toString()}`);
  console.log(`💰 Transaction fee: ${receipt.transactionFee ? receipt.transactionFee.toString() : 'N/A'}`);
  
} catch (error) {
  console.log("❌ Transfer failed:");
  console.log(`   Error: ${error.message}`);
  console.log(`   Status: ${error.status ? error.status.toString() : 'Unknown'}`);
}

console.log("🏁 Script completed!");
process.exit();
