"use client";

import { DashboardData } from "@/services/charts.services";
import { compactFormat } from "@/lib/format-number";

interface DashboardMetricCardsProps {
  data: DashboardData;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  label: string;
  icon: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

function MetricCard({ title, value, label, icon, trend }: MetricCardProps) {
  return (
    <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{icon}</span>
            <h4 className="text-dark dark:text-white font-medium">{title}</h4>
          </div>
          <div className="mb-2">
            <h2 className="text-2xl font-bold text-dark dark:text-white">
              {typeof value === 'number' ? compactFormat(value) : value}
            </h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-medium ${
            trend.isPositive ? 'text-green-500' : 'text-red-500'
          }`}>
            <span>{trend.isPositive ? '↗' : '↘'}</span>
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function DashboardMetricCards({ data }: DashboardMetricCardsProps) {
  const { metrics } = data;

  // Format revenue value
  const formatRevenue = (value: number): string => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M VND`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K VND`;
    }
    return `${value} VND`;
  };

  // Calculate top revenue user (mock data for now)
  const topRevenueUser = {
    value: Math.floor(metrics.revenueGrowth.total * 0.3), // Assume top user is ~30% of total
    trend: 103.7 // Mock trend value
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      <MetricCard
        title="Total Users"
        value={metrics.userGrowth.total}
        label={metrics.userGrowth.label}
        icon="👥"
      />

      <MetricCard
        title="Total Transactions"
        value={metrics.transactionGrowth.total}
        label={metrics.transactionGrowth.label}
        icon="💳"
      />

      <MetricCard
        title="Total Revenue"
        value={formatRevenue(metrics.revenueGrowth.total)}
        label={metrics.revenueGrowth.label}
        icon="💰"
      />

      <MetricCard
        title="Top Contributor Revenue"
        value={formatRevenue(topRevenueUser.value)}
        label="Highest earning user this period"
        icon="⭐"
        trend={{
          value: topRevenueUser.trend,
          isPositive: topRevenueUser.trend > 0
        }}
      />
    </div>
  );
}
