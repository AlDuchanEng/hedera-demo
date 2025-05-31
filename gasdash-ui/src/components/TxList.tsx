import React, { useState, useEffect, useCallback } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Stack
} from '@mui/material';
import { 
  fetchAccountTransactions, 
  formatTimestamp, 
  tinybarsToHbar,
  HederaTransaction 
} from '../services/mirrorNodeClient';

export default function TxList() {
  // Use account ID from environment variables or fallback to the one from .env
  const defaultAccountId = process.env.REACT_APP_OPERATOR_ID || '0.0.6090816';
  const [accountId, setAccountId] = useState(defaultAccountId);
  const [transactions, setTransactions] = useState<HederaTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Auto-fetch transactions when component mounts with default account
  useEffect(() => {
    if (defaultAccountId) {
      handleFetchTransactions();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFetchTransactions = useCallback(async () => {
    if (!accountId.trim()) {
      setError('Please enter a valid account ID');
      return;
    }

    setLoading(true);
    setError(null);
    setTransactions([]); // Clear previous results
    
    try {
      console.log('Fetching transactions for account:', accountId);
      const response = await fetchAccountTransactions(accountId, 10);
      console.log('Received response:', response);
        if (response.transactions && Array.isArray(response.transactions)) {
        setTransactions(response.transactions);
        if (response.transactions.length === 0) {
          setError(`No transactions found for account ${accountId}. This could mean:
          • The account is new or has no transaction history
          • The account ID might be incorrect
          • Try with a known active account like 0.0.2`);
        }
      } else {
        setError('Unexpected response format from Mirror Node API');
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions');    } finally {
      setLoading(false);
    }
  }, [accountId]); // Dependencies for useCallback
  return (
    <Box sx={{ mt: 4, width: '100%', maxWidth: '1200px' }}>
      <Typography variant="h4" color="white" gutterBottom sx={{ fontWeight: 800, letterSpacing: 1, textShadow: '0 2px 8px rgba(0,0,0,0.25)' }}>
        Transaction List
      </Typography>
      
      {/* Input Section */}
      <Paper sx={{ p: 3, mb: 3, backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)' }}>
        <Stack spacing={3}>
          <TextField
            label="Hedera Account ID"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            placeholder="e.g., 0.0.123456789"
            variant="outlined"
            fullWidth
            sx={{
              backgroundColor: 'white',
              borderRadius: 1,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#ccc',
                },
                '& input': {
                  fontFamily: 'monospace',
                  fontSize: '16px',
                  padding: '12px 14px',
                },
              },
            }}
          />
          
          {/* Quick Access Buttons for Common Accounts */}
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Button
              size="small"
              variant="outlined"
              onClick={() => setAccountId('0.0.2')}
              sx={{ 
                fontSize: '12px',
                color: 'white',
                borderColor: 'white',
                '&:hover': {
                  borderColor: '#fff',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Treasury (0.0.2)
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() => setAccountId(defaultAccountId)}
              sx={{ 
                fontSize: '12px',
                color: 'white',
                borderColor: 'white',
                '&:hover': {
                  borderColor: '#fff',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Test Account ({defaultAccountId})
            </Button>
          </Stack>
          
          <Button
            variant="contained"
            onClick={handleFetchTransactions}
            disabled={loading}
            sx={{ 
              height: 56,
              maxWidth: '200px',
              fontSize: '16px',
              fontWeight: 'bold',
              alignSelf: 'flex-start'
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'FETCH LAST 10'}
          </Button>
        </Stack>
      </Paper>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      )}      {/* Transactions Table */}
      {!loading && transactions.length > 0 && (
        <TableContainer component={Paper} sx={{ mt: 2, maxHeight: '600px', overflow: 'auto', backgroundColor: '#23272f' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 900, fontSize: '1.1rem', color: '#23272f' }}>Timestamp</TableCell>
                <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 900, fontSize: '1.1rem', color: '#23272f' }}>Transaction Type</TableCell>
                <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 900, fontSize: '1.1rem', color: '#23272f' }}>Fee (tinybars)</TableCell>
                <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 900, fontSize: '1.1rem', color: '#23272f' }}>Fee (HBAR)</TableCell>
                <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 900, fontSize: '1.1rem', color: '#23272f' }}>Result</TableCell>
                <TableCell sx={{ backgroundColor: '#f5f5f5', fontWeight: 900, fontSize: '1.1rem', color: '#23272f' }}>Transaction ID</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((tx, index) => (
                <TableRow key={tx.transaction_id || index}>
                  <TableCell>
                    {formatTimestamp(tx.consensus_timestamp)}
                  </TableCell>
                  <TableCell>
                    {tx.name || 'UNKNOWN'}
                  </TableCell>
                  <TableCell>
                    {tx.charged_tx_fee?.toLocaleString() || 'N/A'}
                  </TableCell>
                  <TableCell>
                    {tx.charged_tx_fee ? tinybarsToHbar(tx.charged_tx_fee).toFixed(8) : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Box
                      component="span"
                      sx={{
                        color: tx.result === 'SUCCESS' ? 'green' : 'red',
                        fontWeight: 'bold'
                      }}
                    >
                      {tx.result}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box
                      component="span"
                      sx={{
                        fontFamily: 'monospace',
                        fontSize: '0.8rem',
                        wordBreak: 'break-all'
                      }}
                    >
                      {tx.transaction_id}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}      {/* No Results */}
      {!loading && transactions.length === 0 && !error && (
        <Alert severity="info">
          No transactions found. Click "FETCH LAST 10" to load transactions for the specified account.
          <br />
          <strong>Tip:</strong> Try with account 0.0.2 (Treasury account) which always has transactions.
        </Alert>
      )}

      {/* TODO Comments for future steps */}
      {/* TODO: Add fee calculation and gas analysis */}
      {/* TODO: Add charts for fee visualization */}
      {/* TODO: Add transaction filtering and pagination */}
      {/* TODO: Add export functionality */}
    </Box>
  );
}
