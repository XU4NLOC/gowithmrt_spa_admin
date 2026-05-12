"use client";

import { compactFormat } from "@/lib/format-number";
import { cn } from "@/lib/utils";
import { getRevenueGrowthData, DashboardMetric, PeriodType } from "@/services/charts.services";
import { RevenueGrowthChart } from "./chart";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

interface RevenueGrowthData {
  total_revenue: number;
  chart: Array<{ x: string; y: number }>;
}

interface RevenueGrowthProps {
  className?: string;
  // Legacy props
  timeFrame?: string;
  // New dashboard props
  dashboardData?: DashboardMetric;
  periodType?: PeriodType;
  periodLabel?: string;
}

export function RevenueGrowth({ 
  className,
  timeFrame,
  dashboardData,
  periodType,
  periodLabel
}: RevenueGrowthProps) {
  const { accessToken } = useAuth();
  const [data, setData] = useState<RevenueGrowthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if we're using the new dashboard data format
  const isUsingDashboardData = dashboardData && periodType && periodLabel;

  useEffect(() => {
    if (isUsingDashboardData) {
      // Use provided dashboard data
      const transformedData: RevenueGrowthData = {
        total_revenue: dashboardData.total,
        chart: dashboardData.columns.map(column => ({
          x: column.label,
          y: column.value
        }))
      };
      setData(transformedData);
      setLoading(false);
      setError(null);
      return;
    }

    // Legacy mode - fetch data using the old API
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getRevenueGrowthData(timeFrame, accessToken || undefined);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        console.error('Error fetching revenue growth data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeFrame, accessToken, dashboardData, periodType, periodLabel, isUsingDashboardData]);

  if (loading) {
    return (
      <div className={cn(
        "rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}>
        <div className="border-b border-stroke px-6 py-5.5 dark:border-dark-3">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
        <div className="p-6">
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={cn(
        "rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}>
        <div className="border-b border-stroke px-6 py-5.5 dark:border-dark-3">
          <h2 className="mb-1.5 text-2xl font-bold text-dark dark:text-white">
            Revenue Growth
          </h2>
        </div>
        <div className="p-6 text-center text-red-500">
          {error || 'Failed to load data'}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <div className="border-b border-stroke px-6 py-5.5 dark:border-dark-3">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="mb-1.5 text-2xl font-bold text-dark dark:text-white">
              {isUsingDashboardData ? `Revenue Growth - ${periodLabel}` : 'Revenue Growth'}
            </h2>
            <div className="text-sm font-medium">
              {isUsingDashboardData ? dashboardData.label : 'Revenue This Period'}
            </div>
          </div>
          <div className="text-right">
            <div className="mb-0.5 text-2xl font-bold text-dark dark:text-white">
              {compactFormat(data.total_revenue)}
            </div>
          </div>
        </div>
      </div>
      <RevenueGrowthChart data={data.chart} periodType={periodType} />
    </div>
  );
}