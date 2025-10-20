import { ethers } from 'ethers';
import {
  PLASMA_RPC_URL,
  PLASMA_FALLBACK_RPC,
  SPLUSD_TOKEN_ADDRESS,
  USDT0_TOKEN_ADDRESS,
  PROTOCOLS,
  ERC20_ABI,
  KNOWN_CONTRACTS,
} from '../config';
import type { TokenDistribution, DashboardData, IdleWalletHistoryPoint, BorrowerDestination } from '../types';

// Local storage key for historical data
const HISTORY_STORAGE_KEY = 'splusd_idle_wallet_history';

// Euler Vault address
const EULER_VAULT_ADDRESS = '0x93827c26602b0573500D2eC80dB19D54EEf76BaB';

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

// Load historical data from localStorage
const loadHistoricalData = (): IdleWalletHistoryPoint[] => {
  try {
    const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading historical data:', error);
  }
  return [];
};

// Save historical data to localStorage
const saveHistoricalData = (history: IdleWalletHistoryPoint[]): void => {
  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving historical data:', error);
  }
};

// Add a new data point to history
const addHistoricalDataPoint = (percentage: number): IdleWalletHistoryPoint[] => {
  const history = loadHistoricalData();
  const now = Date.now();
  const newPoint: IdleWalletHistoryPoint = {
    timestamp: now,
    percentage,
    date: new Date(now).toISOString(),
  };

  // Only add if it's been at least 5 minutes since last data point
  // or if this is the first data point
  if (history.length === 0 || now - history[history.length - 1].timestamp > 5 * 60 * 1000) {
    history.push(newPoint);
    // Keep only last 30 days of data (approximately 8640 data points at 5-minute intervals)
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
    const filteredHistory = history.filter(point => point.timestamp > thirtyDaysAgo);
    saveHistoricalData(filteredHistory);
    return filteredHistory;
  }

  return history;
};

// Analyze where borrowed USDT0 from Euler vault goes
export const analyzeBorrowerDestinations = async (
  provider: ethers.JsonRpcProvider
): Promise<BorrowerDestination[]> => {
  try {
    const usdt0Contract = new ethers.Contract(USDT0_TOKEN_ADDRESS, ERC20_ABI, provider);

    // Get recent transfer events from the Euler vault (last 10000 blocks ~7 days)
    const currentBlock = await provider.getBlockNumber();
    const fromBlock = Math.max(0, currentBlock - 10000);

    // Get Transfer events where Euler vault is the sender (borrowers receiving USDT0)
    const transferFilter = usdt0Contract.filters.Transfer(EULER_VAULT_ADDRESS, null);
    const transferEvents = await usdt0Contract.queryFilter(transferFilter, fromBlock, currentBlock);

    // Track destinations
    const destinations = new Map<string, { amount: bigint; type: string; name: string }>();

    for (const event of transferEvents) {
      if (!event.args) continue;

      const borrower = event.args[1]; // 'to' address
      const amount = event.args[2];

      // Get the next transaction from the borrower to see where they sent the USDT0
      // For now, we'll track immediate transfers from borrowers
      const borrowerFilter = usdt0Contract.filters.Transfer(borrower, null);
      try {
        const borrowerTransfers = await usdt0Contract.queryFilter(
          borrowerFilter,
          event.blockNumber,
          Math.min(event.blockNumber + 100, currentBlock)
        );

        for (const transfer of borrowerTransfers) {
          if (!transfer.args) continue;
          const destination = transfer.args[1];
          const transferAmount = transfer.args[2];

          // Identify the destination
          const knownContract = KNOWN_CONTRACTS[destination.toLowerCase()];
          let destName = 'Unknown Protocol';
          let destType = 'unknown';

          if (knownContract) {
            destName = knownContract.name;
            destType = knownContract.type;
          } else {
            // Check if it's one of our tracked protocols
            for (const [key, protocol] of Object.entries(PROTOCOLS)) {
              if (protocol.addresses.map(a => a.toLowerCase()).includes(destination.toLowerCase())) {
                destName = protocol.name;
                destType = 'deposit';
                break;
              }
            }
          }

          const key = `${destName}-${destType}`;
          const existing = destinations.get(key);
          if (existing) {
            existing.amount += transferAmount;
          } else {
            destinations.set(key, {
              amount: transferAmount,
              type: destType,
              name: destName,
            });
          }
        }
      } catch (error) {
        console.warn('Error tracking borrower transfer:', error);
      }
    }

    // Calculate total and convert to BorrowerDestination array
    const totalAmount = Array.from(destinations.values()).reduce(
      (sum, dest) => sum + dest.amount,
      0n
    );

    const decimals = 6; // USDT0 typically uses 6 decimals

    const result: BorrowerDestination[] = Array.from(destinations.entries()).map(([_, dest]) => {
      const percentage = totalAmount > 0n
        ? Number((dest.amount * 10000n) / totalAmount) / 100
        : 0;

      return {
        protocol: dest.name,
        type: dest.type as any,
        amount: formatTokenAmount(dest.amount, decimals),
        percentage,
        color: getColorForDestinationType(dest.type),
        description: getDescriptionForType(dest.type),
      };
    });

    return result.sort((a, b) => b.percentage - a.percentage);
  } catch (error) {
    console.error('Error analyzing borrower destinations:', error);
    return [];
  }
};

// Helper function to get color for destination type
const getColorForDestinationType = (type: string): string => {
  switch (type) {
    case 'swap':
      return '#f59e0b'; // amber
    case 'bridge':
      return '#8b5cf6'; // purple
    case 'deposit':
      return '#10b981'; // green
    default:
      return '#6b7280'; // gray
  }
};

// Helper function to get description for type
const getDescriptionForType = (type: string): string => {
  switch (type) {
    case 'swap':
      return 'Swapped to other tokens';
    case 'bridge':
      return 'Bridged to other chains';
    case 'deposit':
      return 'Deposited in protocol';
    default:
      return 'Unknown destination';
  }
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
        const distribution: TokenDistribution = {
          location: protocol.name,
          amount: formatTokenAmount(totalBalance, decimals),
          percentage,
          address: protocol.addresses[0], // Show primary address
        };

        // For Euler Protocol, analyze borrower destinations
        if (_key === 'euler') {
          try {
            const borrowerDestinations = await analyzeBorrowerDestinations(provider);
            if (borrowerDestinations.length > 0) {
              distribution.borrowerDestinations = borrowerDestinations;
            }
          } catch (error) {
            console.warn('Failed to analyze Euler borrower destinations:', error);
          }
        }

        distributions.push(distribution);
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

    // Add current idle wallet percentage to historical data
    const idleWalletHistory = addHistoricalDataPoint(idlePercentage);

    return {
      totalSupply: formatTokenAmount(totalSupply, decimals),
      distributions: distributions.sort((a, b) => b.percentage - a.percentage),
      lastUpdate: Date.now(),
      idleWalletHistory,
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
