const https = require('https');

// Test with a known active account
async function testAPI() {
  const accountId = '0.0.2'; // Treasury account, always has transactions
  const url = `https://testnet.mirrornode.hedera.com/api/v1/accounts/${accountId}/transactions?limit=3&order=desc`;
  
  console.log('Testing Mirror Node API...');
  console.log('URL:', url);
  
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('Status:', res.statusCode);
        
        if (res.statusCode === 200) {
          const parsed = JSON.parse(data);
          console.log('✅ Success! Found', parsed.transactions?.length || 0, 'transactions');
          
          if (parsed.transactions?.[0]) {
            const tx = parsed.transactions[0];
            console.log('Latest transaction:');
            console.log('- ID:', tx.transaction_id);
            console.log('- Type:', tx.name);
            console.log('- Result:', tx.result);
            console.log('- Fee:', tx.charged_tx_fee, 'tinybars');
          }
        } else {
          console.log('❌ Error:', res.statusCode, res.statusMessage);
          console.log('Response:', data);
        }
        resolve(data);
      });
    }).on('error', err => {
      console.log('❌ Network error:', err.message);
      reject(err);
    });
  });
}

testAPI().catch(console.error);
