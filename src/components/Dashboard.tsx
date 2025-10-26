import { useState, useEffect } from 'react';
import { Header } from './Header';
import { QuickStats } from './QuickStats';
import { DistributionCard } from './DistributionCard';
import { DistributionChart } from './DistributionChart';
import { ErrorMessage } from './ErrorMessage';
import { LoadingSpinner } from './LoadingSpinner';
import { SectionHeader } from './ui/SectionHeader';
import { BarChart3 } from 'lucide-react';
import type { DashboardData } from '../types';
import { fetchDistributionData, exportToCSV, exportToJSON } from '../utils/blockchain';
import { UPDATE_INTERVAL } from '../config';

export const Dashboard = () => {
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
    <div className="min-h-screen bg-plasma-dark p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <Header
          lastUpdate={data?.lastUpdate || Date.now()}
          onRefresh={loadData}
          onExportCSV={handleExportCSV}
          onExportJSON={handleExportJSON}
          isLoading={isLoading}
        />

        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} onRetry={loadData} />
          </div>
        )}

        {data && data.distributions.length > 0 && (
          <>
            {/* Quick Stats */}
            <QuickStats data={data} />

            {/* Distribution Section */}
            <SectionHeader
              title="Protocol Distribution"
              subtitle="See how splUSD is distributed across DeFi protocols"
              icon={BarChart3}
            />

            {/* Distribution Chart */}
            <div className="mb-6">
              <DistributionChart distributions={data.distributions} />
            </div>

            {/* Distribution Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
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
