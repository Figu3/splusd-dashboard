export interface TokenDistribution {
  location: string;
  amount: string;
  percentage: number;
  usdValue?: string;
  change24h?: number;
  address?: string;
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
