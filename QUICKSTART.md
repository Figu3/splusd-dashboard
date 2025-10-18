# Quick Start Guide

Get the splUSD Distribution Dashboard running in under 5 minutes!

## Prerequisites

- Node.js 18 or higher
- npm (comes with Node.js)

## Installation & Running

### 1. Navigate to the project directory

```bash
cd splusd-dashboard
```

### 2. Install dependencies

```bash
npm install
```

This will install all required packages including React, ethers.js, Tailwind CSS, and Recharts.

### 3. Start the development server

```bash
npm run dev
```

You should see output like:

```
VITE v7.1.10  ready in 234 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h + enter to show help
```

### 4. Open your browser

Navigate to `http://localhost:5173` (or whatever port is shown in your terminal)

The dashboard will automatically:
- Connect to the Plasma blockchain
- Fetch the splUSD token contract data
- Query protocol balances
- Display the distribution in real-time
- Auto-refresh every 30 seconds

## What You'll See

The dashboard displays:

1. **Header Section**
   - Total splUSD supply
   - Last update timestamp
   - Refresh, Export CSV, and Export JSON buttons

2. **Distribution Chart**
   - Interactive pie chart showing token distribution
   - Color-coded by protocol
   - Percentage breakdowns

3. **Protocol Cards**
   - Individual cards for each location (Idle Wallets, Lithos, Pendle, etc.)
   - Token amount and percentage
   - Contract addresses with links to PlasmaScan
   - Visual progress bars

## Testing Features

### Manual Refresh
Click the "Refresh" button to manually fetch the latest data.

### Export Data
- Click "Export CSV" to download a spreadsheet-friendly file
- Click "Export JSON" to download raw JSON data

### Mobile Responsive
Resize your browser window to see the responsive design in action.

## Production Build

To create a production-ready build:

```bash
npm run build
```

The optimized files will be in the `dist/` directory.

To preview the production build locally:

```bash
npm run preview
```

## Customization

### Change Update Interval

Edit `src/config.ts`:

```typescript
export const UPDATE_INTERVAL = 60000; // Change to 60 seconds
```

### Add Custom RPC Endpoint

Edit `src/config.ts`:

```typescript
export const PLASMA_RPC_URL = 'https://your-custom-rpc-url.com';
```

### Add New Protocol Addresses

Edit `src/config.ts` and add to the `PROTOCOLS` object:

```typescript
myProtocol: {
  name: 'My Protocol',
  addresses: ['0xYourContractAddress'],
  color: '#ff5733', // Hex color code
},
```

## Troubleshooting

### "Error Loading Data" Message

**Possible causes:**
- RPC endpoint is rate-limited
- No internet connection
- Plasma blockchain is experiencing issues

**Solutions:**
1. Click the "Retry" button
2. Check your internet connection
3. Try using a different RPC endpoint (see Customization above)
4. Consider using a paid RPC provider (Alchemy, QuickNode)

### Build Fails

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Port 5173 is already in use

The dev server will automatically try the next available port (5174, 5175, etc.)

Or specify a custom port:

```bash
npm run dev -- --port 3000
```

## Next Steps

- Read the full [README.md](./README.md) for detailed documentation
- Check [PROTOCOL_ADDRESSES.md](./PROTOCOL_ADDRESSES.md) for all contract addresses
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment instructions
- Explore the `src/` directory to understand the code structure

## Project Structure

```
splusd-dashboard/
├── src/
│   ├── components/     # React components
│   ├── utils/          # Blockchain utilities
│   ├── config.ts       # Configuration
│   └── types.ts        # TypeScript types
├── public/             # Static assets
└── dist/              # Production build (after npm run build)
```

## Common Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Support & Resources

- [Plasma Docs](https://docs.plasma.to)
- [ethers.js Docs](https://docs.ethers.org)
- [Vite Docs](https://vite.dev)
- [React Docs](https://react.dev)

## Success Indicators

You'll know the dashboard is working correctly when you see:

✅ No error messages in the browser console
✅ Total supply is displayed (should be > 0)
✅ Multiple distribution cards are visible
✅ Pie chart is rendered with multiple colored sections
✅ Percentages add up to approximately 100%
✅ Export buttons download files successfully

---

**Need help?** Check the full documentation in [README.md](./README.md)
