const https = require('https');

// Test account info endpoint first
async function testAccountInfo(accountId) {
  return new Promise((resolve, reject) => {
    const url = `https://testnet.mirrornode.hedera.com/api/v1/accounts/${accountId}`;
    console.log('Testing account info URL:', url);
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('Status:', res.statusCode);
        
        if (res.statusCode !== 200) {
          console.log('Response body:', data);
          reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
          return;
        }
        
        try {
          const parsed = JSON.parse(data);
          console.log('Account found:', parsed.account);
          console.log('Balance:', parsed.balance?.balance);
          resolve(parsed);
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function testTransactions(accountId) {
  return new Promise((resolve, reject) => {
    const url = `https://testnet.mirrornode.hedera.com/api/v1/accounts/${accountId}/transactions?limit=5&order=desc`;
    console.log('Testing transactions URL:', url);
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('Status:', res.statusCode);
        
        if (res.statusCode !== 200) {
          console.log('Response body:', data);
          reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
          return;
        }
        
        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function runTests() {
  const accountId = '0.0.6090816';
  
  console.log(`Testing account: ${accountId}\n`);
  
  try {
    console.log('--- Testing account info ---');
    const accountInfo = await testAccountInfo(accountId);
    console.log('✅ Account info retrieved successfully');
    
    console.log('\n--- Testing transactions ---');
    const transactions = await testTransactions(accountId);
    console.log('✅ Transactions retrieved successfully');
    console.log('Number of transactions:', transactions.transactions?.length || 0);
    
    if (transactions.transactions && transactions.transactions.length > 0) {
      const tx = transactions.transactions[0];
      console.log('Latest transaction:');
      console.log('- ID:', tx.transaction_id);
      console.log('- Type:', tx.name);
      console.log('- Result:', tx.result);
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

runTests();
