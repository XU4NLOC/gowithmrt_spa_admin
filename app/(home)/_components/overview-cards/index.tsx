import { compactFormat } from "@/lib/format-number";
import { getOverviewData } from "../../fetch";
import { OverviewCard } from "./card";
import * as icons from "./icons";
import { UserGrowthSummaryCard } from "./user-growth-summary-card";
import { TransactionGrowthSummaryCard } from "./transaction-growth-summary-card";
import { RevenueGrowthSummaryCard } from "./revenue-growth-summary-card";
import { TopRevenueUsersCard } from "./top-revenue-users-card";

export async function OverviewCardsGroup() {
  const { views, profit, products, users } = await getOverviewData();

  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      <UserGrowthSummaryCard />

      <TransactionGrowthSummaryCard />

      <RevenueGrowthSummaryCard />

      <TopRevenueUsersCard />
    </div>
  );
}
