"use client";

import { useEffect, useState } from "react";
import { OverviewCard } from "./card";
import * as icons from "./icons";
import { compactFormat } from "@/lib/format-number";
import { getTopUsersByRevenue } from "@/services/charts.services";
import { useAuth } from "@/contexts/AuthContext";

type TopUser = {
  name: string;
  revenue: number;
  profileImage: string;
  rank: number;
  groupCount: number;
  avgRevenuePerGroup: number;
};

export function TopRevenueUsersCard() {
  const { accessToken } = useAuth();
  const [topUsers, setTopUsers] = useState<TopUser[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setIsLoading(true);
        const data = await getTopUsersByRevenue(undefined, accessToken || undefined);
        if (isMounted) {
          setTopUsers(data);
          setError(null);
        }
      } catch (err: any) {
        if (isMounted) setError(err?.message || "Failed to load top revenue users");
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
        label="Top Contributor Revenue"
        data={{ value: "…", growthRate: 0 }}
        Icon={icons.Users}
      />
    );
  }

  if (error || !topUsers || topUsers.length === 0) {
    return (
      <OverviewCard
        label="Top Contributor Revenue"
        data={{ value: "—", growthRate: 0 }}
        Icon={icons.Users}
      />
    );
  }

  const best = topUsers[0];
  const value = `${compactFormat(best.revenue)} VND`;
  // Use avg revenue per group (scaled) as a proxy metric for trend arrow
  const growthRate = Number((best.avgRevenuePerGroup / 1000).toFixed(2));

  return (
    <OverviewCard
      label="Top Contributor Revenue"
      data={{ value, growthRate }}
      Icon={icons.Users}
    />
  );
}


