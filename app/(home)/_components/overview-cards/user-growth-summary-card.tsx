"use client";

import { useEffect, useState } from "react";
import { OverviewCard } from "./card";
import * as icons from "./icons";
import { compactFormat } from "@/lib/format-number";
import { getUserGrowthSummary } from "@/services/charts.services";
import { useAuth } from "@/contexts/AuthContext";

type Summary = {
  currentTotalUsers: number;
  totalNewUsersLast7Days: number;
  totalNewUsersLast30Days: number;
  avgNewUsersPerDayLast7Days: number;
  avgNewUsersPerDayLast30Days: number;
  bestDayLast30Days: any;
  last7DaysData: any[];
  generatedAt: string;
};

export function UserGrowthSummaryCard() {
  const { accessToken } = useAuth();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setIsLoading(true);
        const data = await getUserGrowthSummary(accessToken || undefined);
        if (isMounted) {
          setSummary(data);
          setError(null);
        }
      } catch (err: any) {
        if (isMounted) setError(err?.message || "Failed to load user growth summary");
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
        label="Total Users"
        data={{ value: "…", growthRate: 0 }}
        Icon={icons.Users}
      />
    );
  }

  if (error || !summary) {
    return (
      <OverviewCard
        label="Total Users"
        data={{ value: "—", growthRate: 0 }}
        Icon={icons.Users}
      />
    );
  }

  const value = compactFormat(summary.currentTotalUsers);
  // Use 7-day average as the growth indicator for dashboard brevity
  const growthRate = Number((summary.avgNewUsersPerDayLast7Days || 0).toFixed(2));

  return (
    <OverviewCard
      label="Total Users"
      data={{ value, growthRate }}
      Icon={icons.Users}
    />
  );
}


