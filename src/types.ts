export type DestinationType = 'swap' | 'bridge' | 'deposit' | 'unknown';

export interface BorrowerDestination {
  protocol: string;
  type: DestinationType;
  amount: string;
  percentage: number;
  address?: string;
  color?: string;
  description?: string;
}

export interface TokenDistribution {
  location: string;
  amount: string;
  percentage: number;
  usdValue?: string;
  change24h?: number;
  address?: string;
  borrowerDestinations?: BorrowerDestination[];
}

export interface IdleWalletHistoryPoint {
  timestamp: number;
  percentage: number;
  date: string;
}

export interface DashboardData {
  totalSupply: string;
  distributions: TokenDistribution[];
  lastUpdate: number;
  idleWalletHistory?: IdleWalletHistoryPoint[];
  error?: string;
}

export interface ProtocolConfig {
  name: string;
  addresses: string[];
  color: string;
  icon?: string;
}
