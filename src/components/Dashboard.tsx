import { useState, useEffect } from 'react';
import { Header } from './Header';
import { DistributionCard } from './DistributionCard';
import { DistributionChart } from './DistributionChart';
import { IdleWalletHistoryChart } from './IdleWalletHistoryChart';
import { TVLHistoryChart } from './TVLHistoryChart';
import { PLUSDShareCard } from './PLUSDShareCard';
import { RestakingVault } from './RestakingVault';
import { ErrorMessage } from './ErrorMessage';
import { LoadingSpinner } from './LoadingSpinner';
import type { DashboardData } from '../types';
import { fetchDistributionData, exportToCSV, exportToJSON } from '../utils/blockchain';
import { UPDATE_INTERVAL } from '../config';

type TabType = 'distribution' | 'restaking';

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<TabType>('distribution');
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await fetchDistributionData();

      if (result.error) {
        setError(result.error);
      } else {
        setData(result);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Set up auto-refresh
    const interval = setInterval(loadData, UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  const handleExportCSV = () => {
    if (data) {
      exportToCSV(data.distributions);
    }
  };

  const handleExportJSON = () => {
    if (data) {
      exportToJSON(data);
    }
  };

  if (isLoading && !data) {
    return (
      <div className="min-h-screen bg-plasma-dark p-6">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-plasma-dark p-6">
      <div className="max-w-7xl mx-auto">
        <Header
          totalSupply={data?.totalSupply || '0'}
          lastUpdate={data?.lastUpdate || Date.now()}
          onRefresh={loadData}
          onExportCSV={handleExportCSV}
          onExportJSON={handleExportJSON}
          isLoading={isLoading}
        />

        {/* Tab Navigation */}
        <div className="mb-6 bg-plasma-card rounded-xl p-2 border border-plasma-border flex gap-2">
          <button
            onClick={() => setActiveTab('distribution')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
              activeTab === 'distribution'
                ? 'bg-gradient-to-r from-plasma-accent to-purple-500 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-plasma-dark/50'
            }`}
          >
            Distribution Dashboard
          </button>
          <button
            onClick={() => setActiveTab('restaking')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
              activeTab === 'restaking'
                ? 'bg-gradient-to-r from-plasma-accent to-purple-500 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-plasma-dark/50'
            }`}
          >
            Restaking
          </button>
        </div>

        {/* Distribution Tab Content */}
        {activeTab === 'distribution' && (
          <>
            {error && (
              <div className="mb-6">
                <ErrorMessage message={error} onRetry={loadData} />
              </div>
            )}

            {data && data.distributions.length > 0 && (
              <>
                {/* TVL History Chart */}
                {data.tvlHistory && data.tvlHistory.length > 0 && (
                  <div className="mb-6">
                    <TVLHistoryChart history={data.tvlHistory} />
                  </div>
                )}

                {/* plUSD Share Card */}
                {data.plusdShare && (
                  <div className="mb-6">
                    <PLUSDShareCard plusdShare={data.plusdShare} />
                  </div>
                )}

                {/* Idle Wallet History Chart */}
                {data.idleWalletHistory && data.idleWalletHistory.length > 0 && (
                  <div className="mb-6">
                    <IdleWalletHistoryChart history={data.idleWalletHistory} />
                  </div>
                )}

                {/* Distribution Chart */}
                <div className="mb-6">
                  <DistributionChart distributions={data.distributions} />
                </div>

                {/* Distribution Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.distributions.map((distribution, index) => (
                    <DistributionCard key={index} distribution={distribution} />
                  ))}
                </div>
              </>
            )}

            {data && data.distributions.length === 0 && !error && (
              <div className="text-center text-gray-400 py-12">
                No distribution data available
              </div>
            )}
          </>
        )}

        {/* Restaking Tab Content */}
        {activeTab === 'restaking' && <RestakingVault />}

        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>
            Data sourced from Plasma blockchain (Chain ID: 9745)
          </p>
          <p className="mt-2">
            splUSD Token:{' '}
            <a
              href="https://plasmascan.to/token/0x616185600989Bf8339b58aC9e539d49536598343"
              target="_blank"
              rel="noopener noreferrer"
              className="text-plasma-accent hover:underline"
            >
              0x6161...8343
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
};
