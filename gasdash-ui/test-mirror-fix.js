// Test the updated mirror node client
const https = require('https');

const MIRROR_NODE_BASE_URL = 'https://testnet.mirrornode.hedera.com/api/v1';

async function testAccountTransactions(accountId) {
  return new Promise((resolve, reject) => {
    const url = `${MIRROR_NODE_BASE_URL}/accounts/${accountId}/transactions?limit=10&order=desc`;
    console.log('Testing URL:', url);
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('Status:', res.statusCode);
        console.log('Headers:', res.headers);
        
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
  console.log('Testing Mirror Node API with different accounts...\n');
  
  // Test with the account from the image
  const testAccounts = [
    '0.0.6090812342234',
    '0.0.6090816',
    '0.0.2'  // Known system account with lots of transactions
  ];
  
  for (const accountId of testAccounts) {
    console.log(`\n--- Testing account: ${accountId} ---`);
    try {
      const result = await testAccountTransactions(accountId);
      console.log('✅ Success!');
      console.log('Transactions found:', result.transactions?.length || 0);
      
      if (result.transactions && result.transactions.length > 0) {
        const tx = result.transactions[0];
        console.log('Latest transaction:');
        console.log('- Type:', tx.name);
        console.log('- Result:', tx.result);
        console.log('- Timestamp:', tx.consensus_timestamp);
      }
    } catch (error) {
      console.log('❌ Error:', error.message);
    }
  }
}

runTests();
