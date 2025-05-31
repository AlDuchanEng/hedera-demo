import Footer from './components/Footer';
import CssBaseline from '@mui/material/CssBaseline';
import NavBar from './components/Navbar';
import { Box, ThemeProvider } from '@mui/material';
import { AllWalletsProvider } from './services/wallets/AllWalletsProvider';
import AppRouter from './AppRouter';
import { theme } from './theme';
import "./App.css";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AllWalletsProvider>
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            backgroundColor: '#23272f', // Changed to a simple dark color
            // Removed backgroundImage and related properties
          }}
        >
          <header>
            <NavBar />
          </header>
          <Box
            flex={1}
            p={3}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minHeight: 'calc(100vh - 140px)', // Account for header and footer
              overflow: 'auto'
            }}
          >
            <AppRouter />
          </Box>
          <Footer />
        </Box>
      </AllWalletsProvider>
    </ThemeProvider>
  );
}

export default App;