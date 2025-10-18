export interface TokenDistribution {
  location: string;
  amount: string;
  percentage: number;
  usdValue?: string;
  change24h?: number;
  address?: string;
}

export interface DashboardData {
  totalSupply: string;
  distributions: TokenDistribution[];
  lastUpdate: number;
  error?: string;
}

export interface ProtocolConfig {
  name: string;
  addresses: string[];
  color: string;
  icon?: string;
}
