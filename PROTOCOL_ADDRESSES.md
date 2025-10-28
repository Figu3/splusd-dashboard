# Protocol Contract Addresses on Plasma

This document lists all the contract addresses used by the splUSD Distribution Dashboard to track token distribution.

## Token Contract

### splUSD (Staked Plasma USD)
- **Address**: `0x616185600989Bf8339b58aC9e539d49536598343`
- **Symbol**: splUSD
- **Decimals**: 18 (standard ERC-20)
- **Type**: ERC-20 Token
- **Explorer**: [View on PlasmaScan](https://plasmascan.to/token/0x616185600989Bf8339b58aC9e539d49536598343)

---

## Lithos DEX Contracts

Lithos is a ve(3,3) decentralized exchange on Plasma.

### Core Contracts
- **Router**: `0xD70962bd7C6B3567a8c893b55a8aBC1E151759f3`
  - Used for: Token swaps and liquidity provision

- **PairFactory**: `0x71a870D1c935C2146b87644DF3B5316e8756aE18`
  - Used for: Creating and managing liquidity pairs

### Governance Contracts
- **VotingEscrow (veLITH)**: `0x2Eff716Caa7F9EB441861340998B0952AF056686`
  - Used for: Locked LITH tokens for governance

- **Voter**: `0x2AF460a511849A7aA37Ac964074475b0E6249c69`
  - Used for: Gauge voting and emissions distribution

### Additional Contracts
- **GlobalRouter**: `0xC7E4BCC695a9788fd0f952250cA058273BE7F6A3`
- **TradeHelper**: `0xf2e70f25a712B2FEE0B76d5728a620707AF5D42c`
- **LITH Token**: `0xAbB48792A3161E81B47cA084c0b7A22a50324A44`
- **GaugeFactory**: `0xA0Ce83fd2003e7C7F06E01E917a3E57fceee41A0`
- **BribeFactory**: `0x9CfC6d1C1309457160A4BcAB3F71A16a09336788`

**Documentation**: [Lithos Docs](https://docs.lithos.to)

---

## Pendle Protocol Contracts

Pendle is a yield trading platform that enables users to tokenize and trade future yield.

### Core Infrastructure
- **Router**: `0x888888888889758F76e7103c6CbF23ABbF58F946`
  - Used for: Main entry point for Pendle interactions

- **Router Static**: `0x6813d43782395A1F2AAb42f39aeEDE03ac655e09`
  - Used for: View functions and static calls

### Factory Contracts
- **Market Factory V5**: `0x28dE02Ac3c3F5ef427e55c321F73fDc7F192e8E4`
  - Used for: Creating and managing Pendle markets

- **Yield Contract Factory V5**: `0xED0dC8C074255c277BC704D6b096167D7a6E4311`
  - Used for: Deploying PT and YT tokens

- **SY Factory**: `0x466CeD3b33045Ea986B2f306C8D0aA8067961CF8`
  - Used for: Standardized Yield tokens

### Governance & Staking
- **vePendle**: `0x0d7432A9f5C51fdd2407332D90D9b814827982Bf`
  - Used for: Locked PENDLE for governance

- **Gauge Controller**: `0x7e500c6efBb00FD3227888256E477171a1304721`
  - Used for: Managing liquidity incentives

### Oracles & Utilities
- **PY/YT/LP Oracle**: `0x9a9fa8338dd5e5b2188006f1cd2ef26d921650c2`
- **Pendle Swap**: `0xd4F480965D2347d421F1bEC7F545682E5Ec2151D`
- **Limit Router**: `0x000000000000c9B3E2C3Ec88B1B4c0cD853f4321`
- **Proxy Admin**: `0xA28c08f165116587D4F3E708743B4dEe155c5E64`

### Active Markets on Plasma
- sUSDe Pool (APY: ~25.9%, TVL: $8.74M)
- USDe Pool (APY: ~12.67%, TVL: $14.34M)
- syrupUSDT Pool (APY: ~190%, TVL: $163K)

**Documentation**: [Pendle Docs](https://docs.pendle.finance)

---

## Euler Protocol Contracts

Euler is a permissionless lending protocol.

### Core Contracts
- **Euler Frontier Vault**: `0x93827c26602b0573500D2eC80dB19D54EEf76BaB`
  - Used for: Lending and borrowing splUSD

**Documentation**: [Euler Finance](https://www.euler.finance)

---

## Balancer Protocol Contracts

Balancer is an automated portfolio manager and liquidity provider.

### Core Contracts
- **Balancer V2 Vault**: `0xbA1333333333a1BA1108E8412f11850A5C319bA9`
  - Used for: Holds all pool tokens and manages swaps

**Documentation**: [Balancer Docs](https://docs.balancer.fi)

---

## Redemption Vault

The Redemption Vault allows users to redeem splUSD.

### Core Contracts
- **Redemption Vault**: `0x69EcaB6aA7bDFDdD99deF0891c0317076430ae50`
  - Used for: splUSD redemption mechanism

---

## How to Find Additional Addresses

### Method 1: PlasmaScan Explorer
1. Visit https://plasmascan.to
2. Search for protocol names (Lithos, Pendle, Euler)
3. Filter by "Contracts" to find verified contracts

### Method 2: Protocol Documentation
- Lithos: https://docs.lithos.to/developer-documentation/deployed-contracts
- Pendle: https://github.com/pendle-finance/pendle-core-v2-public/blob/main/deployments/9745-core.json
- Euler: Check official docs for Plasma deployments

### Method 3: On-Chain Discovery
Use the dashboard's blockchain query functionality to:
1. Monitor transfer events from splUSD contract
2. Identify high-volume receiving addresses
3. Verify contracts on PlasmaScan
4. Add to configuration

---

## Adding New Protocol Addresses

To add a new protocol to the dashboard:

1. **Update `src/config.ts`**:

```typescript
export const PROTOCOLS: Record<string, ProtocolConfig> = {
  // ... existing protocols
  newProtocol: {
    name: 'New Protocol Name',
    addresses: [
      '0xYourContractAddress1',
      '0xYourContractAddress2',
    ],
    color: '#hexcolor',
  },
};
```

2. **Verify addresses** on PlasmaScan

3. **Test** that balances are fetched correctly

4. **Update this document** with the new addresses

---

## Plasma Network Information

- **Chain ID**: 9745
- **Currency**: XPL
- **RPC Endpoints**:
  - dRPC: https://plasma.drpc.org
  - Official: https://rpc.plasma.to
  - Alchemy: https://plasma-mainnet.g.alchemy.com/{api-key}
  - QuickNode: Custom endpoint
- **Explorer**: https://plasmascan.to
- **Type**: EVM-compatible Layer 1

---

## Important Notes

1. **Multiple Addresses per Protocol**: Some protocols use multiple contracts (routers, factories, vaults). The dashboard sums balances across all addresses.

2. **Idle Wallets Calculation**:
   ```
   Idle Balance = Total Supply - Sum(All Protocol Balances)
   ```

3. **Real-time Accuracy**: Addresses are verified as of October 2025. Always check PlasmaScan for the most current information.

4. **Security**: All addresses listed here are pulled from official sources and verified on-chain.

---

## Updates

This document will be updated as:
- New protocols integrate splUSD
- Additional contract addresses are discovered
- Protocol upgrades deploy new contracts

Last Updated: October 18, 2025
