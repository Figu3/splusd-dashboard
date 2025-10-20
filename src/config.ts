import type { ProtocolConfig } from './types';

// Plasma Chain Configuration
export const PLASMA_CHAIN_ID = 9745;
export const PLASMA_RPC_URL = 'https://plasma-mainnet.g.alchemy.com/v2/ph0FUrSi6-8SvDzvJYtc1';
export const PLASMA_FALLBACK_RPC = 'https://rpc.plasma.to';

// splUSD Token
export const SPLUSD_TOKEN_ADDRESS = '0x616185600989Bf8339b58aC9e539d49536598343';

// USDT0 Token (used in Euler vaults)
export const USDT0_TOKEN_ADDRESS = '0x5f0c5F854C2D34F34B69CF63217C0C5EA1F1A13d';

// Protocol Configurations
export const PROTOCOLS: Record<string, ProtocolConfig> = {
  lithos: {
    name: 'Lithos DEX',
    addresses: [
      '0xD70962bd7C6B3567a8c893b55a8aBC1E151759f3', // Router
      '0x71a870D1c935C2146b87644DF3B5316e8756aE18', // Factory
      '0x2Eff716Caa7F9EB441861340998B0952AF056686', // VotingEscrow
      '0x2AF460a511849A7aA37Ac964074475b0E6249c69', // Voter
      '0x55078defe265a66451fd9da109e7362a70b3fdac', // splUSD/plUSD Pool
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
];

// Update interval (in milliseconds)
export const UPDATE_INTERVAL = 30000; // 30 seconds

// Known contract addresses for destination tracking
export const KNOWN_CONTRACTS: Record<string, { name: string; type: 'swap' | 'bridge' | 'deposit' }> = {
  // Lithos DEX (Swaps)
  '0xD70962bd7C6B3567a8c893b55a8aBC1E151759f3': { name: 'Lithos DEX Router', type: 'swap' },
  '0xC7E4BCC695a9788fd0f952250cA058273BE7F6A3': { name: 'Lithos Global Router', type: 'swap' },
  '0x55078defe265a66451fd9da109e7362a70b3fdac': { name: 'Lithos splUSD/plUSD Pool', type: 'deposit' },

  // Pendle (Deposits)
  '0x888888888889758F76e7103c6CbF23ABbF58F946': { name: 'Pendle Router', type: 'deposit' },
  '0xad96C88eC5D39fc5020851075ECb756B2b228060': { name: 'Pendle LP Contract', type: 'deposit' },

  // Bridges (common bridge contracts)
  '0x10E6593CDda8c58a1d0f14C5164B376352a55f2F': { name: 'Stargate Bridge', type: 'bridge' },
  '0x1a44076050125825900e736c501f859c50fE728c': { name: 'Across Bridge', type: 'bridge' },

  // Add more as discovered
};
