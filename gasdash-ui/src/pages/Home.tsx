import { AccountId } from "@hashgraph/sdk";
import { Button, TextField, Typography, Paper } from "@mui/material";
import { Stack } from "@mui/system";
import { useWalletInterface } from "../services/wallets/useWalletInterface";
import SendIcon from '@mui/icons-material/Send';
import { useState } from "react";
import TxList from "../components/TxList";

export default function Home() {
  const { walletInterface } = useWalletInterface();
  const [toAccountId, setToAccountId] = useState("");
  const [amount, setAmount] = useState(1);

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
      
      {/* Transaction List Component */}
      <TxList />
    </Stack>
  )
}