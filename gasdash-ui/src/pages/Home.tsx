import { AccountId } from "@hashgraph/sdk";
import { Button, TextField, Typography, Paper, CircularProgress, Box } from "@mui/material";
import { Stack } from "@mui/system";
import { useWalletInterface } from "../services/wallets/useWalletInterface";
import SendIcon from '@mui/icons-material/Send';
import { useState, useEffect, useCallback } from "react";
import TxList from "../components/TxList";
import TotalFeeCard from "../components/TotalFeeCard";
import { fetchExchangeRate } from "../services/mirrorNodeClient";

export default function Home() {
  const { walletInterface } = useWalletInterface();
  const [toAccountId, setToAccountId] = useState("");
  const [amount, setAmount] = useState(1);
  const [totalTinybar, setTotalTinybar] = useState(0);
  const [usdPerTinybar, setUsdPerTinybar] = useState(0);
  const [exchangeRateLoading, setExchangeRateLoading] = useState(true);

  // Fetch exchange rate on component mount
  useEffect(() => {
    const getExchangeRate = async () => {
      try {
        setExchangeRateLoading(true);
        const rateData = await fetchExchangeRate();
        // Calculate USD per tinybar correctly:
        // 1. Get USD per HBAR: cent_equivalent / 100 / hbar_equivalent
        // 2. Get USD per tinybar: (USD per HBAR) / 100_000_000
        const usdPerHbar = rateData.current_rate.cent_equivalent / 100 / rateData.current_rate.hbar_equivalent;
        const usdPerTinybar = usdPerHbar / 100_000_000;
        setUsdPerTinybar(usdPerTinybar);
        console.log('Exchange rate calculated:', { usdPerHbar, usdPerTinybar });
      } catch (error) {
        console.error('Failed to fetch exchange rate:', error);
        // Fallback to a reasonable default (approximately $0.05 per HBAR)
        setUsdPerTinybar(0.05 / 100_000_000);
      } finally {
        setExchangeRateLoading(false);
      }
    };

    getExchangeRate();
  }, []);

  // Callback to handle total fee changes from TxList
  const handleTotalFeeChange = useCallback((newTotalTinybar: number) => {
    setTotalTinybar(newTotalTinybar);
  }, []);

  return (
    <Stack alignItems="center" spacing={4} sx={{ width: '100%', px: 2 }}>
      <Typography
        variant="h3"
        color="white"
        textAlign="center"
        sx={{
          fontWeight: 900,
          textShadow: '0 2px 8px rgba(0,0,0,0.25)',
          letterSpacing: 1.5,
          mb: 2
        }}
      >
        Hedera Transaction Explorer
      </Typography>
      
      {walletInterface !== null && (
        <Paper sx={{ 
          p: 3, 
          backgroundColor: 'rgba(255, 255, 255, 0.1)', 
          backdropFilter: 'blur(10px)',
          borderRadius: 2,
          maxWidth: '800px',
          width: '100%'
        }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            gap={2}
            alignItems='center'
            justifyContent='center'
            flexWrap='wrap'
          >
            <Typography color="white">
              Transfer
            </Typography>
            <TextField
              type='number'
              label='amount'
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value))}
              sx={{
                maxWidth: '100px',
                backgroundColor: 'white',
                borderRadius: 1
              }} 
            />
            <Typography color="white">
              HBAR to
            </Typography>
            <TextField
              value={toAccountId}
              onChange={(e) => setToAccountId(e.target.value)}
              label='account id or evm address'
              sx={{
                minWidth: '200px',
                backgroundColor: 'white',
                borderRadius: 1
              }}
            />
            <Button
              variant='contained'
              onClick={async () => {
                await walletInterface.transferHBAR(AccountId.fromString(toAccountId), amount);
              }}
              sx={{ 
                height: '56px',
                minWidth: '56px'
              }}
            >
              <SendIcon />
            </Button>
          </Stack>
        </Paper>
      )}
      
      {/* Show loading indicator if exchange rate is still loading */}
      {exchangeRateLoading && (
        <Box display="flex" alignItems="center" gap={2}>
          <CircularProgress size={24} sx={{ color: 'white' }} />
          <Typography color="white">Loading exchange rate...</Typography>
        </Box>
      )}
      
      {/* Total Fee Card - show only when not loading and we have data */}
      {!exchangeRateLoading && totalTinybar > 0 && (
        <TotalFeeCard 
          totalTinybar={totalTinybar} 
          usdPerTinybar={usdPerTinybar} 
        />
      )}
      
      {/* TODO: Add latency KPIs here */}
      
      {/* Transaction List Component */}
      <TxList onTotalFeeChange={handleTotalFeeChange} />
    </Stack>
  )
}