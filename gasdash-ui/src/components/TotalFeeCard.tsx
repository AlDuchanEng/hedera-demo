import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

interface TotalFeeCardProps {
  totalTinybar: number;
  usdPerTinybar: number;
}

export default function TotalFeeCard({ totalTinybar, usdPerTinybar }: TotalFeeCardProps) {
  const totalHbar = totalTinybar / 100_000_000;
  const totalUsd = totalTinybar * usdPerTinybar;

  return (
    <Card sx={{ 
      maxWidth: '400px', 
      width: '100%', 
      backgroundColor: 'rgba(255, 255, 255, 0.1)', 
      backdropFilter: 'blur(10px)',
      mb: 3
    }}>
      <CardContent>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ fontWeight: 'bold', color: 'white', mb: 2 }}
        >
          Total Transaction Fees (Last 10)
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography 
            variant="h4" 
            sx={{ fontWeight: 'bold', color: '#00ff88' }}
          >
            {totalHbar.toFixed(8)} HBAR
          </Typography>
          
          <Typography 
            variant="h5" 
            sx={{ fontWeight: 'bold', color: '#ffd700' }}
          >
            ${totalUsd.toFixed(4)} USD
          </Typography>
          
          <Typography 
            variant="caption" 
            sx={{ color: 'rgba(255, 255, 255, 0.7)', mt: 1 }}
          >
            {totalTinybar.toLocaleString()} tinybars
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
