export type DestinationType = 'swap' | 'bridge' | 'deposit' | 'mint' | 'unknown';

export interface BorrowerAction {
  type: DestinationType;
  protocol: string;
  amount: string;
  percentage: number;
  token?: string;
  description: string;
  color: string;
}

export interface BorrowerInfo {
  address: string;
  borrowedAmount: string;
  collateralAmount: string;
  collateralizationRatio: number;
  actions: BorrowerAction[];
}

export interface BorrowerDestination {
  protocol: string;
  type: DestinationType;
  amount: string;
  percentage: number;
  address?: string;
  color?: string;
  description?: string;
}

export interface PendleBreakdown {
  sy: { amount: string; percentage: number };
  pt: { amount: string; percentage: number };
  yt: { amount: string; percentage: number };
}

export interface TokenDistribution {
  location: string;
  amount: string;
  percentage: number;
  usdValue?: string;
  change24h?: number;
  address?: string;
  borrowerDestinations?: BorrowerDestination[];
  borrowers?: BorrowerInfo[];
  pendleBreakdown?: PendleBreakdown;
}

export interface IdleWalletHistoryPoint {
  timestamp: number;
  percentage: number;
  date: string;
}

export interface TVLHistoryPoint {
  timestamp: number;
  tvl: string;
  tvlRaw: string;
  date: string;
}

export interface PLUSDShareData {
  plusdInSplUSD: string;
  plusdInSplUSDRaw: string;
  totalSplUSD: string;
  totalSplUSDRaw: string;
  percentage: number;
  lastUpdate: number;
}

export interface DashboardData {
  totalSupply: string;
  distributions: TokenDistribution[];
  lastUpdate: number;
  idleWalletHistory?: IdleWalletHistoryPoint[];
  tvlHistory?: TVLHistoryPoint[];
  plusdShare?: PLUSDShareData;
  error?: string;
}

export interface ProtocolConfig {
  name: string;
  addresses: string[];
  color: string;
  icon?: string;
}
