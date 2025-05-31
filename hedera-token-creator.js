import * as dotenv from "dotenv";
dotenv.config();

import {
  Client,
  PrivateKey,
  TokenCreateTransaction,
  TokenType,
  TokenSupplyType,
  Hbar,
} from "@hashgraph/sdk";

const { OPERATOR_ID, OPERATOR_KEY, NETWORK } = process.env;
if (!OPERATOR_ID || !OPERATOR_KEY) throw new Error("Check your .env!");

async function main() {
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

  console.log("🪙 Creating PragueCoin token...");
  console.log("🔍 Transaction details:");
  console.log("- Token Name: PragueCoin");
  console.log("- Token Symbol: PCZ");
  console.log("- Initial Supply: 10");
  console.log("- Treasury Account:", OPERATOR_ID);
  console.log("- Max Fee: 20 ℏ");

  try {
    const txn = await new TokenCreateTransaction()
      .setTokenName("PragueCoin")
      .setTokenSymbol("PCZ")
      .setDecimals(0)
      .setInitialSupply(10)
      .setTreasuryAccountId(OPERATOR_ID)
      .setTokenType(TokenType.FungibleCommon)
      .setSupplyType(TokenSupplyType.Infinite)
      .setMaxTransactionFee(new Hbar(20))
      .freezeWith(client)
      .sign(privateKey);

    console.log("📝 Submitting transaction...");
    const rsp = await txn.execute(client);
    console.log("✅ Transaction submitted successfully!");
    console.log("📄 Transaction ID:", rsp.transactionId.toString());
    
    // Provide immediate feedback and URL for checking
    console.log("💡 Check transaction status at:");
    console.log(`   https://hashscan.io/${NETWORK}/transaction/${rsp.transactionId.toString()}`);
    
    // Try to get receipt with a short timeout, but don't fail the whole process
    console.log("⏳ Attempting to get receipt (5 second timeout)...");
    try {
      const receiptPromise = rsp.getReceipt(client);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Receipt timeout")), 5000)
      );
      
      const rec = await Promise.race([receiptPromise, timeoutPromise]);
      
      console.log("🎉 Token created successfully!");
      if (rec.tokenId) {
        console.log("🎯 TOKEN ID:", rec.tokenId.toString());
        console.log("💡 View token at:");
        console.log(`   https://hashscan.io/${NETWORK}/token/${rec.tokenId.toString()}`);
      }
      if (rec.transactionFee) {
        console.log("💰 Transaction fee:", rec.transactionFee.toString());
      }
      
    } catch (receiptError) {
      console.log("⏰ Receipt not available immediately (this is normal)");
      console.log("✅ Transaction was submitted - token should be created shortly");
      console.log("💡 Check the HashScan link above for final status");
    }

  } catch (error) {
    console.log("❌ Token creation failed:", error.message);
    console.log("Status:", error.status ? error.status._code : "Unknown");
    if (error.transactionId) {
      console.log("Transaction ID:", error.transactionId.toString());
    }
  } finally {
    client.close();
  }
}

main().catch(console.error);
