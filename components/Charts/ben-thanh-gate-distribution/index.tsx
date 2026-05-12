"use client";

import { cn } from "@/lib/utils";
import { getBenThanhGateDistribution, PeriodType } from "@/services/charts.services";
import { BenThanhGateDistributionChart } from "./chart";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

interface GateData {
  gate: string;
  count: number;
  percentage: number;
}

interface BenThanhGateDistributionProps {
  className?: string;
  // Legacy prop
  timeFrame?: string;
  // New period picker props
  periodType?: PeriodType;
  periodLabel?: string;
}

export function BenThanhGateDistribution({ 
  className,
  timeFrame,
  periodType,
  periodLabel
}: BenThanhGateDistributionProps) {
  const { accessToken } = useAuth();
  const [data, setData] = useState<GateData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Determine which period to use - prioritize periodType over timeFrame
        const periodToUse = periodType || timeFrame;
        const result = await getBenThanhGateDistribution(periodToUse, accessToken || undefined);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        console.error('Error fetching gate distribution data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeFrame, periodType, accessToken]);

  if (loading) {
    return (
      <div className={cn(
        "rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}>
        <div className="border-b border-stroke px-6 py-5.5 dark:border-dark-3">
          <h2 className="text-2xl font-bold text-dark dark:text-white">
            {periodLabel ? `Ben Thanh Station Gate Distribution - ${periodLabel}` : 'Ben Thanh Station Gate Distribution'}
          </h2>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Percentage of trips starting from each gate
          </div>
        </div>
        <div className="p-6 flex justify-center">
          <div className="w-full max-w-xs">
            <div className="animate-pulse">
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn(
        "rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}>
        <div className="border-b border-stroke px-6 py-5.5 dark:border-dark-3">
          <h2 className="text-2xl font-bold text-dark dark:text-white">
            {periodLabel ? `Ben Thanh Station Gate Distribution - ${periodLabel}` : 'Ben Thanh Station Gate Distribution'}
          </h2>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Percentage of trips starting from each gate
          </div>
        </div>
        <div className="p-6 text-center text-red-500">
          {error}
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
        <h2 className="text-2xl font-bold text-dark dark:text-white">
          {periodLabel ? `Ben Thanh Station Gate Distribution - ${periodLabel}` : 'Ben Thanh Station Gate Distribution'}
        </h2>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Percentage of trips starting from each gate
        </div>
      </div>
      <div className="p-6 flex justify-center">
        <div className="w-full max-w-xs">
          <BenThanhGateDistributionChart data={data} />
        </div>
      </div>
    </div>
  );
} 