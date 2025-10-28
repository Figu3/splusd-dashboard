# splUSD Distribution Dashboard

A real-time dashboard that tracks the distribution and movement of splUSD (Staked Plasma USD) tokens across different protocols on the Plasma blockchain.

![Dashboard Preview](https://img.shields.io/badge/Chain-Plasma-blue) ![License](https://img.shields.io/badge/license-MIT-green)

## Features

- **Real-time Tracking**: Monitor splUSD token distribution across DeFi protocols
- **Visual Analytics**: Interactive pie chart showing distribution percentages
- **Protocol Breakdown**: Detailed cards for each protocol holding splUSD
- **Auto-refresh**: Automatic data updates every 30 seconds
- **Export Functionality**: Download data in CSV or JSON format
- **Dark Mode UI**: Modern, professional interface with Plasma theme
- **Mobile Responsive**: Works seamlessly on all devices

## Tracked Protocols

The dashboard monitors splUSD distribution across:

1. **Idle Wallets** - Tokens in regular wallets (not deployed in protocols)
2. **Lithos DEX** - Plasma's native ve(3,3) decentralized exchange
3. **Pendle Protocol** - Yield trading and tokenization platform
4. **Euler Protocol** - Permissionless lending and borrowing
5. **Balancer** - Automated portfolio manager and liquidity provider
6. **Redemption Vault** - splUSD redemption mechanism
7. **Other DeFi Protocols** - Additional DeFi integrations

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Blockchain**: ethers.js v6
- **Charts**: Recharts
- **Icons**: Lucide React

## Token & Network Details

- **Token**: Staked Plasma USD (splUSD)
- **Contract Address**: `0x616185600989Bf8339b58aC9e539d49536598343`
- **Blockchain**: Plasma (EVM-compatible Layer 1)
- **Chain ID**: 9745
- **RPC Endpoints**:
  - Primary: `https://plasma.drpc.org`
  - Fallback: `https://rpc.plasma.to`
- **Explorer**: https://plasmascan.to

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Basic understanding of blockchain and DeFi

### Installation

1. **Clone or download the project**

```bash
cd splusd-dashboard
```

2. **Install dependencies**

```bash
npm install
```

3. **Start the development server**

```bash
npm run dev
```

4. **Open your browser**

Navigate to `http://localhost:5173` (or the port shown in terminal)

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready to deploy to any static hosting service.

### Preview Production Build

```bash
npm run preview
```

## Configuration

### RPC Endpoints

You can modify the RPC endpoints in `src/config.ts`:

```typescript
export const PLASMA_RPC_URL = 'https://plasma.drpc.org';
export const PLASMA_FALLBACK_RPC = 'https://rpc.plasma.to';
```

For production use, consider using:
- Alchemy: `https://plasma-mainnet.g.alchemy.com/<your-api-key>`
- QuickNode: Get your endpoint from quicknode.com

### Update Interval

Adjust the auto-refresh interval (default: 30 seconds):

```typescript
export const UPDATE_INTERVAL = 30000; // milliseconds
```

### Protocol Addresses

Protocol contract addresses are defined in `src/config.ts`. See `PROTOCOL_ADDRESSES.md` for the complete list.

## How It Works

### Data Calculation

1. **Total Supply**: Fetched directly from the splUSD token contract
2. **Protocol Balances**: Query `balanceOf()` for each protocol's contract addresses
3. **Idle Wallets**: Calculated as `Total Supply - Sum of Protocol Balances`
4. **Percentages**: Each balance divided by total supply × 100

### Data Flow

```
User Opens Dashboard
     ↓
Connect to Plasma RPC
     ↓
Fetch Token Contract
     ↓
Query Total Supply & Decimals
     ↓
Query Balances for Each Protocol
     ↓
Calculate Distributions
     ↓
Display in UI
     ↓
Auto-refresh every 30s
```

## Project Structure

```
splusd-dashboard/
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx           # Main dashboard component
│   │   ├── Header.tsx              # Header with stats and controls
│   │   ├── DistributionCard.tsx    # Protocol distribution cards
│   │   ├── DistributionChart.tsx   # Pie chart visualization
│   │   ├── ErrorMessage.tsx        # Error display component
│   │   └── LoadingSpinner.tsx      # Loading state component
│   ├── utils/
│   │   └── blockchain.ts           # Blockchain interaction logic
│   ├── types.ts                    # TypeScript type definitions
│   ├── config.ts                   # Configuration & constants
│   ├── App.tsx                     # App root component
│   ├── main.tsx                    # Entry point
│   └── index.css                   # Global styles
├── public/                         # Static assets
├── package.json                    # Dependencies
├── tailwind.config.js              # Tailwind configuration
├── vite.config.ts                  # Vite configuration
└── README.md                       # This file
```

## Features in Detail

### Real-time Updates

The dashboard automatically refreshes data every 30 seconds without user interaction. A manual refresh button is also available.

### Export Data

- **CSV Export**: Download a spreadsheet-friendly format
- **JSON Export**: Get raw data including metadata

### Error Handling

- Automatic fallback to secondary RPC endpoint
- Graceful error messages with retry functionality
- Loading states for better UX

### Responsive Design

The dashboard adapts to different screen sizes:
- Desktop: 3-column grid layout
- Tablet: 2-column grid layout
- Mobile: Single column stacked layout

## Deployment

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm run build
# Drag and drop the 'dist' folder to Netlify
```

### Deploy to GitHub Pages

1. Update `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/splusd-dashboard/',
  // ... rest of config
})
```

2. Build and deploy:

```bash
npm run build
# Push dist folder to gh-pages branch
```

See `DEPLOYMENT.md` for detailed deployment instructions for all platforms.

## Troubleshooting

### RPC Connection Issues

If you see "Error Loading Data":
- Check your internet connection
- Try the fallback RPC endpoint
- Consider using a paid RPC provider (Alchemy, QuickNode)

### Build Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Chart Not Displaying

Ensure `recharts` is installed:
```bash
npm install recharts
```

## Future Enhancements

- [ ] Historical data tracking and trend analysis
- [ ] 24-hour change indicators
- [ ] Price feed integration for USD values
- [ ] Alerts for significant movements
- [ ] Wallet connection to show user's balance
- [ ] Comparison with other staked tokens
- [ ] Integration with DeFiLlama API

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

MIT License - feel free to use this project for any purpose.

## Resources

- [Plasma Documentation](https://docs.plasma.to)
- [Lithos DEX](https://lithos.to)
- [Pendle Finance](https://www.pendle.finance)
- [Euler Finance](https://www.euler.finance)
- [ethers.js Documentation](https://docs.ethers.org)

## Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review Plasma documentation
3. Open an issue in this repository

---

**Built with** ❤️ **for the Plasma ecosystem**
