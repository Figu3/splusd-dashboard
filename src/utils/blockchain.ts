import { ethers } from 'ethers';
import {
  PLASMA_RPC_URL,
  PLASMA_FALLBACK_RPC,
  SPLUSD_TOKEN_ADDRESS,
  PLUSD_TOKEN_ADDRESS,
  USDT0_TOKEN_ADDRESS,
  PENDLE_SY_TOKEN,
  PENDLE_PT_TOKEN,
  PENDLE_YT_TOKEN,
  PROTOCOLS,
  ERC20_ABI,
  EULER_VAULT_ABI,
  KNOWN_CONTRACTS,
} from '../config';
import type { TokenDistribution, DashboardData, IdleWalletHistoryPoint, TVLHistoryPoint, PLUSDShareData, PendleBreakdown, BorrowerDestination, BorrowerInfo } from '../types';

// Local storage key for historical data
const HISTORY_STORAGE_KEY = 'splusd_idle_wallet_history';
const TVL_HISTORY_STORAGE_KEY = 'splusd_tvl_history';

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

// Load TVL historical data from localStorage
const loadTVLHistoricalData = (): TVLHistoryPoint[] => {
  try {
    const stored = localStorage.getItem(TVL_HISTORY_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading TVL historical data:', error);
  }
  return [];
};

// Save TVL historical data to localStorage
const saveTVLHistoricalData = (history: TVLHistoryPoint[]): void => {
  try {
    localStorage.setItem(TVL_HISTORY_STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving TVL historical data:', error);
  }
};

// Add a new TVL data point to history
const addTVLHistoricalDataPoint = (tvlRaw: string, tvlFormatted: string): TVLHistoryPoint[] => {
  const history = loadTVLHistoricalData();
  const now = Date.now();
  const newPoint: TVLHistoryPoint = {
    timestamp: now,
    tvl: tvlFormatted,
    tvlRaw: tvlRaw,
    date: new Date(now).toISOString(),
  };

  // Only add if it's been at least 5 minutes since last data point
  // or if this is the first data point
  if (history.length === 0 || now - history[history.length - 1].timestamp > 5 * 60 * 1000) {
    history.push(newPoint);
    // Keep only last 30 days of data
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
    const filteredHistory = history.filter(point => point.timestamp > thirtyDaysAgo);
    saveTVLHistoricalData(filteredHistory);
    return filteredHistory;
  }

  return history;
};

// Fetch Pendle SY/PT/YT breakdown
const fetchPendleBreakdown = async (
  provider: ethers.JsonRpcProvider,
  decimals: number
): Promise<PendleBreakdown | null> => {
  try {
    const syContract = new ethers.Contract(PENDLE_SY_TOKEN, ERC20_ABI, provider);
    const ptContract = new ethers.Contract(PENDLE_PT_TOKEN, ERC20_ABI, provider);
    const ytContract = new ethers.Contract(PENDLE_YT_TOKEN, ERC20_ABI, provider);

    // Fetch balances in parallel
    const [syBalance, ptBalance, ytBalance] = await Promise.all([
      syContract.balanceOf(SPLUSD_TOKEN_ADDRESS),
      ptContract.balanceOf(SPLUSD_TOKEN_ADDRESS),
      ytContract.balanceOf(SPLUSD_TOKEN_ADDRESS),
    ]);

    const totalPendleBalance = syBalance + ptBalance + ytBalance;

    if (totalPendleBalance === 0n) {
      return null;
    }

    return {
      sy: {
        amount: formatTokenAmount(syBalance, decimals),
        percentage: Number((syBalance * 10000n) / totalPendleBalance) / 100,
      },
      pt: {
        amount: formatTokenAmount(ptBalance, decimals),
        percentage: Number((ptBalance * 10000n) / totalPendleBalance) / 100,
      },
      yt: {
        amount: formatTokenAmount(ytBalance, decimals),
        percentage: Number((ytBalance * 10000n) / totalPendleBalance) / 100,
      },
    };
  } catch (error) {
    console.error('Error fetching Pendle breakdown:', error);
    return null;
  }
};

// Fetch plUSD share in splUSD
const fetchPLUSDShare = async (
  provider: ethers.JsonRpcProvider,
  totalSupplySplUSD: bigint,
  decimals: number
): Promise<PLUSDShareData> => {
  try {
    const plusdContract = new ethers.Contract(PLUSD_TOKEN_ADDRESS, ERC20_ABI, provider);

    // Get plUSD balance in splUSD contract
    const plusdBalance = await plusdContract.balanceOf(SPLUSD_TOKEN_ADDRESS);

    // Get splUSD total supply (use the one we already fetched)
    const splusdTotalSupply = totalSupplySplUSD;

    // Calculate percentage
    const percentage = splusdTotalSupply > 0n
      ? Number((plusdBalance * 10000n) / splusdTotalSupply) / 100
      : 0;

    return {
      plusdInSplUSD: formatTokenAmount(plusdBalance, decimals),
      plusdInSplUSDRaw: plusdBalance.toString(),
      totalSplUSD: formatTokenAmount(splusdTotalSupply, decimals),
      totalSplUSDRaw: splusdTotalSupply.toString(),
      percentage,
      lastUpdate: Date.now(),
    };
  } catch (error) {
    console.error('Error fetching plUSD share:', error);
    // Return default values on error
    return {
      plusdInSplUSD: '0',
      plusdInSplUSDRaw: '0',
      totalSplUSD: formatTokenAmount(totalSupplySplUSD, decimals),
      totalSplUSDRaw: totalSupplySplUSD.toString(),
      percentage: 0,
      lastUpdate: Date.now(),
    };
  }
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
      // Type guard to check if it's an EventLog with args
      if ('args' in event && event.args) {
        const borrower = event.args[1]; // 'to' address

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
            // Type guard to check if it's an EventLog with args
            if ('args' in transfer && transfer.args) {
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
                for (const protocol of Object.values(PROTOCOLS)) {
                  if (protocol.addresses.map(a => a.toLowerCase()).includes(destination.toLowerCase())) {
                    destName = protocol.name;
                    destType = 'deposit';
                    break;
                  }
                }
              }

              const destinationKey = `${destName}-${destType}`;
              const existing = destinations.get(destinationKey);
              if (existing) {
                existing.amount += transferAmount;
              } else {
                destinations.set(destinationKey, {
                  amount: transferAmount,
                  type: destType,
                  name: destName,
                });
              }
            }
          }
        } catch (error) {
          console.warn('Error tracking borrower transfer:', error);
        }
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

// Fetch live borrower data from Euler vault
const fetchLiveBorrowerData = async (provider: ethers.JsonRpcProvider): Promise<BorrowerInfo[]> => {
  try {
    const vaultContract = new ethers.Contract(EULER_VAULT_ADDRESS, EULER_VAULT_ABI, provider);
    const usdt0Contract = new ethers.Contract(USDT0_TOKEN_ADDRESS, ERC20_ABI, provider);

    // Get borrow events from the last 10,000 blocks (approximately 24-48 hours)
    const currentBlock = await provider.getBlockNumber();
    const fromBlock = Math.max(0, currentBlock - 10000);

    console.log(`Fetching borrower data from block ${fromBlock} to ${currentBlock}...`);

    // Get all Borrow events
    const borrowFilter = vaultContract.filters.Borrow();
    const borrowEvents = await vaultContract.queryFilter(borrowFilter, fromBlock, currentBlock);

    // Extract unique borrower addresses
    const borrowerAddresses = new Set<string>();
    for (const event of borrowEvents) {
      const eventLog = event as ethers.EventLog;
      if (eventLog.args && eventLog.args[2]) { // owner is the 3rd indexed parameter
        borrowerAddresses.add(eventLog.args[2] as string);
      }
    }

    console.log(`Found ${borrowerAddresses.size} unique borrowers`);

    // Fetch data for each borrower
    const borrowers: BorrowerInfo[] = [];

    for (const address of Array.from(borrowerAddresses).slice(0, 10)) { // Limit to top 10 borrowers
      try {
        // Get collateral (splUSD balance in vault)
        const collateral = await vaultContract.balanceOf(address);

        // Skip if no collateral
        if (collateral === 0n) continue;

        // Convert vault shares to assets
        const collateralAssets = await vaultContract.convertToAssets(collateral);
        const collateralAmount = formatTokenAmount(collateralAssets, 18);

        // Calculate borrowed amount by analyzing Transfer events from vault to borrower
        const transferFilter = usdt0Contract.filters.Transfer(EULER_VAULT_ADDRESS, address);
        const transferEvents = await usdt0Contract.queryFilter(transferFilter, fromBlock, currentBlock);

        let totalBorrowed = 0n;
        for (const event of transferEvents) {
          const eventLog = event as ethers.EventLog;
          if (eventLog.args && eventLog.args[2]) { // value is the 3rd parameter
            totalBorrowed += BigInt(eventLog.args[2].toString());
          }
        }

        if (totalBorrowed === 0n) continue;

        const borrowedAmount = formatTokenAmount(totalBorrowed, 6); // USDT0 has 6 decimals

        // Calculate CR ratio
        const collateralValue = Number(ethers.formatUnits(collateralAssets, 18));
        const borrowedValue = Number(ethers.formatUnits(totalBorrowed, 6));
        const cr = borrowedValue > 0 ? (collateralValue / borrowedValue) * 100 : 0;

        // Track USDT0 usage
        const actions = await trackUSDT0Usage(provider, address, totalBorrowed, fromBlock, currentBlock);

        borrowers.push({
          address,
          borrowedAmount,
          collateralAmount,
          collateralizationRatio: cr,
          actions
        });
      } catch (error) {
        console.warn(`Error fetching data for borrower ${address}:`, error);
      }
    }

    console.log(`Successfully fetched data for ${borrowers.length} borrowers`);
    return borrowers.sort((a, b) => b.collateralizationRatio - a.collateralizationRatio);
  } catch (error) {
    console.error('Error fetching live borrower data:', error);
    return [];
  }
};

// Track what borrowers did with their USDT0
const trackUSDT0Usage = async (
  provider: ethers.JsonRpcProvider,
  borrowerAddress: string,
  totalBorrowed: bigint,
  fromBlock: number,
  toBlock: number
) => {
  try {
    const usdt0Contract = new ethers.Contract(USDT0_TOKEN_ADDRESS, ERC20_ABI, provider);

    // Get all USDT0 transfers from the borrower
    const transferFilter = usdt0Contract.filters.Transfer(borrowerAddress);
    const transfers = await usdt0Contract.queryFilter(transferFilter, fromBlock, toBlock);

    const destinations: Record<string, bigint> = {};

    for (const transfer of transfers) {
      const eventLog = transfer as ethers.EventLog;
      if (eventLog.args && eventLog.args[1] && eventLog.args[2]) { // to and value parameters
        const dest = (eventLog.args[1] as string).toLowerCase();
        const value = BigInt(eventLog.args[2].toString());
        destinations[dest] = (destinations[dest] || 0n) + value;
      }
    }

    // Convert to actions
    const actions = [];
    for (const [dest, amount] of Object.entries(destinations)) {
      const known = KNOWN_CONTRACTS[dest];
      const percentage = Number((amount * 10000n) / totalBorrowed) / 100;

      if (percentage < 1) continue; // Skip small amounts

      actions.push({
        type: known?.type || 'unknown',
        protocol: known?.name || `Unknown (${dest.slice(0, 6)}...)`,
        amount: formatTokenAmount(amount, 6),
        percentage,
        description: known ? getDescriptionForType(known.type) : 'Transferred to unknown address',
        color: getColorForDestinationType(known?.type || 'unknown')
      });
    }

    return actions.sort((a, b) => b.percentage - a.percentage);
  } catch (error) {
    console.error('Error tracking USDT0 usage:', error);
    return [];
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

        // For Euler Protocol, add live borrower data
        if (_key === 'euler') {
          try {
            // Fetch live borrower information from blockchain
            const liveBorrowers = await fetchLiveBorrowerData(provider);
            if (liveBorrowers.length > 0) {
              distribution.borrowers = liveBorrowers;
            }

            // Also fetch aggregated borrower destinations for backward compatibility
            const borrowerDestinations = await analyzeBorrowerDestinations(provider);
            if (borrowerDestinations.length > 0) {
              distribution.borrowerDestinations = borrowerDestinations;
            }
          } catch (error) {
            console.error('Failed to fetch Euler borrower data:', error);
          }
        }

        // For Pendle Protocol, add SY/PT/YT breakdown
        if (_key === 'pendle') {
          try {
            console.log('Fetching Pendle breakdown...');
            const pendleBreakdown = await fetchPendleBreakdown(provider, decimals);
            console.log('Pendle breakdown result:', pendleBreakdown);
            if (pendleBreakdown) {
              distribution.pendleBreakdown = pendleBreakdown;
              console.log('Pendle breakdown added to distribution');
            } else {
              console.log('Pendle breakdown was null or empty');
            }
          } catch (error) {
            console.error('Failed to fetch Pendle breakdown:', error);
          }
        }

        distributions.push(distribution);
      }
    }

    // Calculate idle wallet balance
    const idleBalance = totalSupply - totalProtocolBalance;
    const idlePercentage = Number((idleBalance * 10000n) / totalSupply) / 100;

    const idleWalletDist = {
      location: 'Idle Wallets',
      amount: formatTokenAmount(idleBalance, decimals),
      percentage: idlePercentage,
    };

    // Add current idle wallet percentage to historical data
    const idleWalletHistory = addHistoricalDataPoint(idlePercentage);

    // Add current TVL to historical data
    const tvlHistory = addTVLHistoricalDataPoint(
      totalSupply.toString(),
      formatTokenAmount(totalSupply, decimals)
    );

    // Fetch plUSD share in splUSD
    const plusdShare = await fetchPLUSDShare(provider, totalSupply, decimals);

    // Sort distributions by percentage (descending) and put Idle Wallets at the end
    const sortedDistributions = distributions.sort((a, b) => b.percentage - a.percentage);
    sortedDistributions.push(idleWalletDist);

    return {
      totalSupply: formatTokenAmount(totalSupply, decimals),
      distributions: sortedDistributions,
      lastUpdate: Date.now(),
      idleWalletHistory,
      tvlHistory,
      plusdShare,
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
