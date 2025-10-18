import { ethers } from 'ethers';
import {
  PLASMA_RPC_URL,
  PLASMA_FALLBACK_RPC,
  SPLUSD_TOKEN_ADDRESS,
  PROTOCOLS,
  ERC20_ABI,
} from '../config';
import type { TokenDistribution, DashboardData } from '../types';

// Initialize provider with fallback and explicit network config
export const getProvider = (): ethers.JsonRpcProvider => {
  // Create static network to prevent ENS lookups
  const network = new ethers.Network('plasma', 9745);

  try {
    const provider = new ethers.JsonRpcProvider(PLASMA_RPC_URL, network, {
      staticNetwork: true,
    });
    // Disable ENS resolution completely
    provider.getResolver = async () => null;
    return provider;
  } catch (error) {
    console.warn('Primary RPC failed, using fallback');
    const provider = new ethers.JsonRpcProvider(PLASMA_FALLBACK_RPC, network, {
      staticNetwork: true,
    });
    // Disable ENS resolution completely
    provider.getResolver = async () => null;
    return provider;
  }
};

// Get token contract instance
export const getTokenContract = (provider: ethers.JsonRpcProvider) => {
  return new ethers.Contract(SPLUSD_TOKEN_ADDRESS, ERC20_ABI, provider);
};

// Format token amount with decimals
export const formatTokenAmount = (amount: bigint, decimals: number): string => {
  const formatted = ethers.formatUnits(amount, decimals);
  const num = parseFloat(formatted);

  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(2) + 'M';
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(2) + 'K';
  }
  return num.toFixed(2);
};

// Fetch token distribution data
export const fetchDistributionData = async (): Promise<DashboardData> => {
  try {
    const provider = getProvider();
    const tokenContract = getTokenContract(provider);

    // Fetch total supply and decimals in parallel (Alchemy supports batching)
    const [totalSupplyBN, decimals] = await Promise.all([
      tokenContract.totalSupply(),
      tokenContract.decimals(),
    ]);

    const totalSupply = totalSupplyBN;

    // Fetch balances for each protocol
    const distributions: TokenDistribution[] = [];
    let totalProtocolBalance = 0n;

    for (const [_key, protocol] of Object.entries(PROTOCOLS)) {
      if (protocol.addresses.length === 0) continue;

      // Fetch all balances in parallel (Alchemy supports batch requests well)
      const balancePromises = protocol.addresses.map(address =>
        tokenContract.balanceOf(address)
      );
      const balances = await Promise.all(balancePromises);

      // Sum up all balances for this protocol
      const totalBalance = balances.reduce((sum, bal) => sum + bal, 0n);
      totalProtocolBalance += totalBalance;

      if (totalBalance > 0n) {
        const percentage = Number((totalBalance * 10000n) / totalSupply) / 100;
        distributions.push({
          location: protocol.name,
          amount: formatTokenAmount(totalBalance, decimals),
          percentage,
          address: protocol.addresses[0], // Show primary address
        });
      }
    }

    // Calculate idle wallet balance
    const idleBalance = totalSupply - totalProtocolBalance;
    const idlePercentage = Number((idleBalance * 10000n) / totalSupply) / 100;

    distributions.unshift({
      location: 'Idle Wallets',
      amount: formatTokenAmount(idleBalance, decimals),
      percentage: idlePercentage,
    });

    return {
      totalSupply: formatTokenAmount(totalSupply, decimals),
      distributions: distributions.sort((a, b) => b.percentage - a.percentage),
      lastUpdate: Date.now(),
    };
  } catch (error) {
    console.error('Error fetching distribution data:', error);
    return {
      totalSupply: '0',
      distributions: [],
      lastUpdate: Date.now(),
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

// Export data as CSV
export const exportToCSV = (data: TokenDistribution[]): void => {
  const headers = ['Location', 'Amount', 'Percentage', 'Address'];
  const rows = data.map(d => [
    d.location,
    d.amount,
    `${d.percentage.toFixed(2)}%`,
    d.address || 'N/A',
  ]);

  const csv = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `splusd-distribution-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

// Export data as JSON
export const exportToJSON = (data: DashboardData): void => {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `splusd-distribution-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
};
