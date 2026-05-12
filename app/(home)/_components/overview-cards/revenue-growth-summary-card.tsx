"use client";

import { useEffect, useState } from "react";
import { OverviewCard } from "./card";
import * as icons from "./icons";
import { compactFormat } from "@/lib/format-number";
import { getRevenueGrowthSummary } from "@/services/charts.services";
import { useAuth } from "@/contexts/AuthContext";

type Summary = {
  currentTotalRevenue: number;
  totalRevenueLast7Days: number;
  totalRevenueLast30Days: number;
  avgRevenuePerDayLast7Days: number;
  avgRevenuePerDayLast30Days: number;
  avgRevenuePerTransactionLast7Days: number;
  avgRevenuePerTransactionLast30Days: number;
  bestDayLast30Days: any;
  last7DaysData: any[];
  currency: string;
  generatedAt: string;
  lastCalculated: string;
};

export function RevenueGrowthSummaryCard() {
  const { accessToken } = useAuth();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setIsLoading(true);
        const data = await getRevenueGrowthSummary(accessToken || undefined);
        if (isMounted) {
          setSummary(data);
          setError(null);
        }
      } catch (err: any) {
        if (isMounted) setError(err?.message || "Failed to load revenue growth summary");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [accessToken]);

  if (isLoading) {
    return (
      <OverviewCard
        label="Total Revenue"
        data={{ value: "…", growthRate: 0 }}
        Icon={icons.Profit}
      />
    );
  }

  if (error || !summary) {
    return (
      <OverviewCard
        label="Total Revenue"
        data={{ value: "—", growthRate: 0 }}
        Icon={icons.Profit}
      />
    );
  }

  const value = `${compactFormat(summary.currentTotalRevenue)} VND`;
  const growthRate = Number((summary.avgRevenuePerDayLast7Days || 0).toFixed(2));

  return (
    <OverviewCard
      label="Total Revenue"
      data={{ value, growthRate }}
      Icon={icons.Profit}
    />
  );
}


