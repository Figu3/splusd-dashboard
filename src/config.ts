import type { ProtocolConfig } from './types';

// Plasma Chain Configuration
export const PLASMA_CHAIN_ID = 9745;
export const PLASMA_RPC_URL = 'https://plasma-mainnet.g.alchemy.com/v2/ph0FUrSi6-8SvDzvJYtc1';
export const PLASMA_FALLBACK_RPC = 'https://rpc.plasma.to';

// splUSD Token
export const SPLUSD_TOKEN_ADDRESS = '0x616185600989Bf8339b58aC9e539d49536598343';

// plUSD Token (used to track share in splUSD)
export const PLUSD_TOKEN_ADDRESS = '0xf91c31299E998C5127Bc5F11e4a657FC0cF358CD';

// USDT0 Token (used in Euler vaults)
export const USDT0_TOKEN_ADDRESS = '0x5f0C5f854C2D34F34b69Cf63217C0c5Ea1F1A13D';

// Pendle Token Addresses
export const PENDLE_SY_TOKEN = '0xad96C88eC5D39fc5020851075ECb756B2b228060';
export const PENDLE_PT_TOKEN = '0xA6C55E31154d39bb0Aa3CA2FF9F7665BDA4e47FC';
export const PENDLE_YT_TOKEN = '0x13E695e95601545657cAaa7cD62a22fa87B62bDD';
export const PENDLE_LP_TOKEN = '0x9D0676EC013cB50B7bF9b291c22B618e9fe86832';

// Protocol Configurations
export const PROTOCOLS: Record<string, ProtocolConfig> = {
  lithos: {
    name: 'Lithos DEX',
    addresses: [
      '0xD70962bd7C6B3567a8c893b55a8aBC1E151759f3', // Router
      '0x71a870D1c935C2146b87644DF3B5316e8756aE18', // Factory
      '0x2Eff716Caa7F9EB441861340998B0952AF056686', // VotingEscrow
      '0x2AF460a511849A7aA37Ac964074475b0E6249c69', // Voter
      '0x55078DEfe265a66451FD9dA109e7362A70b3FDaC', // splUSD/plUSD Pool
    ],
    color: '#8b5cf6',
  },
  pendle: {
    name: 'Pendle Protocol',
    addresses: [
      '0x888888888889758F76e7103c6CbF23ABbF58F946', // Router
      '0x28dE02Ac3c3F5ef427e55c321F73fDc7F192e8E4', // Market Factory
      '0x0d7432A9f5C51fdd2407332D90D9b814827982Bf', // vePendle
      '0xad96C88eC5D39fc5020851075ECb756B2b228060', // Pendle LP Contract
    ],
    color: '#10b981',
  },
  euler: {
    name: 'Euler Protocol',
    addresses: [
      '0x93827c26602b0573500D2eC80dB19D54EEf76BaB', // Euler Frontier Vault
    ],
    color: '#f59e0b',
  },
  balancer: {
    name: 'Balancer',
    addresses: [
      '0xbA1333333333a1BA1108E8412f11850A5C319bA9', // Balancer V2 Vault (holds all pool tokens)
    ],
    color: '#1e293b',
  },
  redemption: {
    name: 'Redemption Vault',
    addresses: [
      '0x69EcaB6aA7bDFDdD99deF0891c0317076430ae50', // Redemption Vault
    ],
    color: '#ef4444',
  },
  other: {
    name: 'Other Protocols',
    addresses: [],
    color: '#6b7280',
  },
};

// ERC-20 ABI (minimal)
export const ERC20_ABI = [
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
];

// Euler Vault ABI (for borrower tracking)
export const EULER_VAULT_ABI = [
  'function totalBorrows() view returns (uint256)',
  'function totalAssets() view returns (uint256)',
  'function balanceOf(address account) view returns (uint256)',
  'function maxWithdraw(address owner) view returns (uint256)',
  'function convertToAssets(uint256 shares) view returns (uint256)',
  'event Borrow(address indexed caller, address indexed receiver, address indexed owner, uint256 assets, uint256 shares)',
  'event Repay(address indexed caller, address indexed receiver, address indexed owner, uint256 assets, uint256 shares)',
  'event Deposit(address indexed sender, address indexed owner, uint256 assets, uint256 shares)',
  'event Withdraw(address indexed sender, address indexed receiver, address indexed owner, uint256 assets, uint256 shares)',
];

// Update interval (in milliseconds)
export const UPDATE_INTERVAL = 30000; // 30 seconds

// Known contract addresses for destination tracking
export const KNOWN_CONTRACTS: Record<string, { name: string; type: 'swap' | 'bridge' | 'deposit' }> = {
  // Lithos DEX (Swaps)
  '0xD70962bd7C6B3567a8c893b55a8aBC1E151759f3': { name: 'Lithos DEX Router', type: 'swap' },
  '0xC7E4BCC695a9788fd0f952250cA058273BE7F6A3': { name: 'Lithos Global Router', type: 'swap' },
  '0x55078DEfe265a66451FD9dA109e7362A70b3FDaC': { name: 'Lithos splUSD/plUSD Pool', type: 'deposit' },

  // Pendle (Deposits)
  '0x888888888889758F76e7103c6CbF23ABbF58F946': { name: 'Pendle Router', type: 'deposit' },
  '0xad96C88eC5D39fc5020851075ECb756B2b228060': { name: 'Pendle LP Contract', type: 'deposit' },

  // Balancer (Deposits)
  '0xdb5617517f53ea689d773ebde54947b597e32f81': { name: 'Balancer splUSD Pool', type: 'deposit' },

  // Bridges (common bridge contracts)
  '0x10E6593CDda8c58a1d0f14C5164B376352a55f2F': { name: 'Stargate Bridge', type: 'bridge' },
  '0x1a44076050125825900e736c501f859c50fE728c': { name: 'Across Bridge', type: 'bridge' },

  // Add more as discovered
};
