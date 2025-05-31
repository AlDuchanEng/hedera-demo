# GasDash - Hedera Transaction Explorer & Gas Analytics Dashboard

GasDash is a modern React-based dashboard for exploring Hedera network transactions and analyzing transaction fees (gas costs). Built on top of the Hedera DApp template, it provides an intuitive interface for monitoring transaction costs and network activity on the Hedera testnet.

## 🌟 Features

### Transaction Analysis
- **Real-time Transaction Fetching**: Query the last 10 transactions for any Hedera account
- **Fee Analytics**: View transaction fees in both tinybars and HBAR with USD conversion
- **Live Exchange Rates**: Automatic USD conversion using real-time Hedera exchange rates
- **Total Fee Calculation**: Aggregate fee analysis for the last 10 transactions

### Wallet Integration
- **Multi-wallet Support**: HashPack, Blade, Kabila, and MetaMask wallet integration
- **HBAR Transfers**: Send HBAR directly from the dashboard
- **Token Operations**: Transfer fungible and non-fungible tokens
- **Contract Execution**: Execute smart contract functions with gas limit control

### User Experience
- **Modern UI**: Clean, responsive design with Material-UI components
- **Dark Theme**: Professional dark theme with glassmorphism effects
- **Real-time Updates**: Live transaction data from Hedera Mirror Node
- **Quick Access**: Pre-configured buttons for testing with treasury and known accounts

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **Framework**: Create React App with TypeScript
- **UI Library**: Material-UI (MUI) with custom theming
- **State Management**: React hooks and context
- **Routing**: React Router for navigation

### Hedera Integration
- **SDK**: `@hashgraph/sdk` for blockchain interactions
- **Wallet Connect**: `@hashgraph/hedera-wallet-connect` for wallet integration
- **Mirror Node**: REST API integration for transaction data
- **Networks**: Testnet support with JSON RPC relay

### Key Components
- **TxList**: Transaction fetching and display component
- **TotalFeeCard**: Fee aggregation and USD conversion
- **WalletInterface**: Unified wallet abstraction layer
- **MirrorNodeClient**: API client for Hedera Mirror Node

## 🚀 Getting Started

### Prerequisites

#### Hedera Testnet Account
- Create an account at [portal.hedera.com](https://portal.hedera.com/register)
- Daily limit: 1000 test HBAR (refillable every 24 hours)
- Fund your account at [portal.hedera.com/faucet](https://portal.hedera.com/faucet)

#### Supported Wallets
- **HashPack**: [Chrome Extension](https://chrome.google.com/webstore/detail/hashpack/gjagmgiddbbciopjhllkdnddhcglnemk)
- **Blade**: [Chrome Extension](https://chrome.google.com/webstore/detail/blade-%E2%80%93-hedera-web3-digit/abogmiocnneedmmepnohnhlijcjpcifd)
- **Kabila**: [Web App](https://www.kabila.app/wallet)
- **MetaMask**: [Chrome Extension](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn) (requires Hedera ECDSA account import)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hedera-demo/gasdash-ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   # Copy and configure environment variables
   cp .env.example .env
   ```
   
   Configure your `.env` file:
   ```env
   REACT_APP_OPERATOR_ID=0.0.YOUR_ACCOUNT_ID
   REACT_APP_NETWORK=testnet
   ```

4. **Start development server**
   ```bash
   npm start
   ```
   
   The app will open at [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

### Transaction Exploration
1. **Connect Wallet**: Click "Connect Wallet" and select your preferred wallet
2. **Enter Account ID**: Input a Hedera account ID (format: 0.0.123456789)
3. **Fetch Transactions**: Click "FETCH LAST 10" to retrieve recent transactions
4. **View Analytics**: See total fees in HBAR and USD for the transaction set

### Quick Testing
- **Treasury Account**: Use `0.0.2` for testing (always has transaction history)
- **Default Account**: Pre-configured test account from environment variables
- **Sample Transactions**: View transaction types, fees, results, and timestamps

### HBAR Transfers
1. **Connect Wallet**: Ensure a wallet is connected
2. **Set Amount**: Enter HBAR amount to transfer
3. **Target Account**: Input recipient account ID or EVM address
4. **Execute Transfer**: Click the send button to initiate transfer

## 🔧 Development

### Project Structure
```
gasdash-ui/
├── public/                 # Static assets
├── src/
│   ├── components/        # React components
│   │   ├── TxList.tsx    # Transaction list component
│   │   ├── TotalFeeCard.tsx # Fee summary component
│   │   └── ...
│   ├── pages/            # Page components
│   │   └── Home.tsx      # Main dashboard page
│   ├── services/         # API and wallet services
│   │   ├── mirrorNodeClient.ts # Mirror Node API client
│   │   └── wallets/      # Wallet integration
│   ├── config/           # Configuration files
│   └── ...
├── package.json
└── README.md
```

### Key Scripts
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run eject      # Eject from Create React App (irreversible)
```

### Environment Variables
```env
REACT_APP_OPERATOR_ID=0.0.6090816    # Default test account
REACT_APP_NETWORK=testnet            # Hedera network
```

## 🌐 API Integration

### Hedera Mirror Node
- **Base URL**: `https://testnet.mirrornode.hedera.com/api/v1`
- **Endpoints**: 
  - `/accounts/{id}/transactions` - Account transactions
  - `/network/exchangerate` - Current exchange rates
- **Rate Limits**: Standard Mirror Node rate limiting applies

### Transaction Data
```typescript
interface HederaTransaction {
  transaction_id: string;
  consensus_timestamp: string;
  charged_tx_fee: number;  // Fee in tinybars
  name: string;            // Transaction type
  result: string;          // SUCCESS/FAIL
  // ... additional fields
}
```

## 🎨 Customization

### Theming
The app uses Material-UI theming with custom styling:
- **Primary Color**: Hedera brand colors
- **Background**: Dark theme with glassmorphism effects
- **Typography**: Styrene A Web font family
- **Components**: Custom styled MUI components

### Wallet Configuration
Add new wallet providers by implementing the `WalletInterface`:
```typescript
interface WalletInterface {
  transferHBAR: (toAddress: AccountId, amount: number) => Promise<TransactionId | string | null>;
  executeContractFunction: (contractId: ContractId, functionName: string, params: any, gasLimit: number) => Promise<TransactionId | string | null>;
  // ... other methods
}
```

## 🧪 Testing

### Manual Testing
1. **Transaction Fetching**: Test with known accounts (0.0.2, test account)
2. **Fee Calculations**: Verify tinybar to HBAR conversions
3. **Exchange Rates**: Check USD conversion accuracy
4. **Wallet Integration**: Test connection and transaction signing

### Test Files
- `simple-test.js` - Basic Mirror Node API testing
- `test-api-fix.js` - API endpoint validation
- `test-transaction-ui.html` - Standalone transaction viewer

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Static Hosting
The `build/` folder contains the production-ready static files that can be deployed to:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront
- Any static hosting service

## 🔗 External Resources

### Hedera Documentation
- [Hedera Developer Portal](https://docs.hedera.com/)
- [Hedera SDK Documentation](https://docs.hedera.com/hedera/sdks-and-apis)
- [Mirror Node API Reference](https://docs.hedera.com/hedera/core-concepts/mirror-nodes)

### JSON RPC Alternatives
- [Hedera JSON RPC Relay](https://github.com/hashgraph/hedera-json-rpc-relay) - Self-hosted option
- [Arkhia](https://www.arkhia.io/features/#api-services) - Community RPC service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🆘 Support

### Common Issues
- **Wallet Connection**: Ensure wallet extension is installed and account is funded
- **Transaction Fetching**: Verify account ID format (0.0.123456789)
- **Exchange Rate Loading**: Check internet connection for Mirror Node API access

### Getting Help
- [Hedera Discord](https://discord.com/invite/hedera) - Community support
- [GitHub Issues](../../issues) - Bug reports and feature requests
- [Hedera Documentation](https://docs.hedera.com/) - Technical documentation

## 🎯 Roadmap

### Upcoming Features
- [ ] Advanced fee analytics and charts
- [ ] Transaction filtering and pagination
- [ ] Export functionality for transaction data
- [ ] Network latency monitoring
- [ ] Historical fee trending
- [ ] Smart contract gas optimization suggestions

---

Built with ❤️ on [Hedera](https://hedera.com/) - The most used, sustainable, enterprise-grade public network
