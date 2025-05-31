/**
 * Simple test script to verify Mirror Node client functionality
 * Run with: node testMirrorNode.js
 */

// Simple fetch implementation for testing
const https = require('https');

const MIRROR_NODE_BASE_URL = 'https://testnet.mirrornode.hedera.com/api/v1';

function fetchAccountTransactions(accountId, limit = 10) {
  return new Promise((resolve, reject) => {
    // Use the correct endpoint format
    const url = `${MIRROR_NODE_BASE_URL}/transactions?account.id=${accountId}&limit=${limit}&order=desc`;
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
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

// Test the functionality
async function testMirrorNode() {
  console.log('Testing Mirror Node API...');
  
  try {
    const result = await fetchAccountTransactions('0.0.6090816', 5);
    console.log('Success! Fetched', result.transactions?.length || 0, 'transactions');
    
    if (result.transactions && result.transactions.length > 0) {
      console.log('Sample transaction:');
      const tx = result.transactions[0];
      console.log('- Type:', tx.name);
      console.log('- Fee:', tx.charged_tx_fee, 'tinybars');
      console.log('- Result:', tx.result);
      console.log('- Timestamp:', tx.consensus_timestamp);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testMirrorNode();
