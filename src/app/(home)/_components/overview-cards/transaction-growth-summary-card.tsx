"use client";

import { useEffect, useState } from "react";
import { OverviewCard } from "./card";
import * as icons from "./icons";
import { compactFormat } from "@/lib/format-number";
import { getTransactionGrowthSummary } from "@/services/charts.services";
import { useAuth } from "@/contexts/AuthContext";

type Summary = {
  currentTotalTransactions: number;
  totalNewTransactionsLast7Days: number;
  totalNewTransactionsLast30Days: number;
  avgNewTransactionsPerDayLast7Days: number;
  avgNewTransactionsPerDayLast30Days: number;
  bestDayLast30Days: any;
  last7DaysData: any[];
  generatedAt: string;
};

export function TransactionGrowthSummaryCard() {
  const { accessToken } = useAuth();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setIsLoading(true);
        const data = await getTransactionGrowthSummary(accessToken || undefined);
        if (isMounted) {
          setSummary(data);
          setError(null);
        }
      } catch (err: any) {
        if (isMounted) setError(err?.message || "Failed to load transaction growth summary");
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
        label="Total Transactions"
        data={{ value: "…", growthRate: 0 }}
        Icon={icons.Profit}
      />
    );
  }

  if (error || !summary) {
    return (
      <OverviewCard
        label="Total Transactions"
        data={{ value: "—", growthRate: 0 }}
        Icon={icons.Profit}
      />
    );
  }

  const value = compactFormat(summary.currentTotalTransactions);
  const growthRate = Number((summary.avgNewTransactionsPerDayLast7Days || 0).toFixed(2));

  return (
    <OverviewCard
      label="Total Transactions"
      data={{ value, growthRate }}
      Icon={icons.Profit}
    />
  );
}


