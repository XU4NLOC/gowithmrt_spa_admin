"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { ProtectedRoute } from "@/components/Auth/ProtectedRoute";
import { PeriodPicker } from "@/components/period-picker";
import { useAuth } from "@/contexts/AuthContext";
import { getDashboardData, PeriodType, DashboardData } from "@/services/charts.services";
import { UserGrowth } from "@/components/Charts/user-growth";
import { TransactionsGrowth } from "@/components/Charts/transactions-growth";
import { RevenueGrowth } from "@/components/Charts/revenue-growth";
import { TopUsersByRevenue } from "@/components/Charts/top-users-by-revenue";
import { BenThanhGateDistribution } from "@/components/Charts/ben-thanh-gate-distribution";
import { DashboardMetricCards } from "@/components/dashboard-metric-cards";

export default function DashboardPage() {
  const { accessToken } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('7_days');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = useCallback(async (periodType: PeriodType) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getDashboardData(periodType, undefined, accessToken || undefined);
      setDashboardData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    loadDashboardData(selectedPeriod);
  }, [selectedPeriod, loadDashboardData]);

  const handlePeriodChange = (newPeriod: PeriodType) => {
    setSelectedPeriod(newPeriod);
  };

  if (loading) {
    return (
      <ProtectedRoute requireAuth={true}>
        <div className="flex justify-end mb-4">
          <PeriodPicker
            useDashboardPeriods={true}
            selectedPeriod={selectedPeriod}
            onPeriodChange={handlePeriodChange}
            minimal={false}
          />
        </div>
        <div className="animate-pulse">
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4 2xl:gap-7.5 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="col-span-12 h-80 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute requireAuth={true}>
        <div className="flex justify-end mb-4">
          <PeriodPicker
            useDashboardPeriods={true}
            selectedPeriod={selectedPeriod}
            onPeriodChange={handlePeriodChange}
            minimal={false}
          />
        </div>
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">
            <h2 className="text-xl font-semibold">Error loading dashboard</h2>
            <p className="text-sm mt-2">{error}</p>
          </div>
          <button
            onClick={() => loadDashboardData(selectedPeriod)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
          >
            Retry
          </button>
        </div>
      </ProtectedRoute>
    );
  }

  if (!dashboardData) {
    return (
      <ProtectedRoute requireAuth={true}>
        <div className="text-center py-12">
          <p className="text-gray-500">No dashboard data available</p>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireAuth={true}>
      <>
        <div className="flex justify-end mb-4">
          <PeriodPicker
            useDashboardPeriods={true}
            selectedPeriod={selectedPeriod}
            onPeriodChange={handlePeriodChange}
            minimal={false}
          />
        </div>

        {/* Metric Cards */}
        <DashboardMetricCards data={dashboardData} />

        <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
          {/* User Growth Widget */}
          <UserGrowth
            className="col-span-12"
            key={`user-growth-${selectedPeriod}`}
            dashboardData={dashboardData.metrics.userGrowth}
            periodType={selectedPeriod}
            periodLabel={dashboardData.periodLabel}
          />

          {/* Transactions Growth Widget */}
          <TransactionsGrowth
            className="col-span-12"
            key={`transactions-growth-${selectedPeriod}`}
            dashboardData={dashboardData.metrics.transactionGrowth}
            periodType={selectedPeriod}
            periodLabel={dashboardData.periodLabel}
          />

          {/* Revenue Growth Widget */}
          <RevenueGrowth
            className="col-span-12"
            key={`revenue-growth-${selectedPeriod}`}
            dashboardData={dashboardData.metrics.revenueGrowth}
            periodType={selectedPeriod}
            periodLabel={dashboardData.periodLabel}
          />

          {/* Ben Thanh Gate Distribution Widget */}
          <BenThanhGateDistribution
            className="col-span-12 xl:col-span-5"
            key={`gate-distribution-${selectedPeriod}`}
            periodType={selectedPeriod}
            periodLabel={dashboardData.periodLabel}
          />

          {/* Top Users By Revenue Widget */}
          <TopUsersByRevenue
            className="col-span-12 xl:col-span-7"
            key={`top-users-${selectedPeriod}`}
            periodType={selectedPeriod}
            periodLabel={dashboardData.periodLabel}
          />
        </div>
      </>
    </ProtectedRoute>
  );
}