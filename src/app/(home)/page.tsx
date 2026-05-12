import { createTimeFrameExtractor } from "@/utils/timeframe-extractor";
import { Suspense } from "react";
import { OverviewCardsGroup } from "./_components/overview-cards";
import { OverviewCardsSkeleton } from "./_components/overview-cards/skeleton";
import { UserGrowth } from "@/components/Charts/user-growth";
import { TransactionsGrowth } from "@/components/Charts/transactions-growth";
import { RevenueGrowth } from "@/components/Charts/revenue-growth";
import { TopUsersByRevenue } from "@/components/Charts/top-users-by-revenue";
import { BenThanhGateDistribution } from "@/components/Charts/ben-thanh-gate-distribution";
import { ProtectedRoute } from "@/components/Auth/ProtectedRoute";

// Disable static optimization for this page to prevent prerendering issues
export const dynamic = 'force-dynamic';

type PropsType = {
  searchParams: Promise<{
    selected_time_frame?: string;
  }>;
};

export default async function Home({ searchParams }: PropsType) {
  const { selected_time_frame } = await searchParams;
  const extractTimeFrame = createTimeFrameExtractor(selected_time_frame);

  return (
    <ProtectedRoute requireAuth={true}>
      <>
        <Suspense fallback={<OverviewCardsSkeleton />}>
          <OverviewCardsGroup />
        </Suspense>

        <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
          {/* User Growth Widget */}
          <UserGrowth
            className="col-span-12"
            key={extractTimeFrame("user_growth")}
            timeFrame={extractTimeFrame("user_growth")?.split(":")[1]}
          />

          {/* Transactions Growth Widget */}
          <TransactionsGrowth
            className="col-span-12"
            key={extractTimeFrame("transactions_growth")}
            timeFrame={extractTimeFrame("transactions_growth")?.split(":")[1]}
          />

          {/* Revenue Growth Widget */}
          <RevenueGrowth
            className="col-span-12"
            key={extractTimeFrame("revenue_growth")}
            timeFrame={extractTimeFrame("revenue_growth")?.split(":")[1]}
          />

          {/* Ben Thanh Gate Distribution Widget */}
          <BenThanhGateDistribution
            className="col-span-12 xl:col-span-5"
          />

          {/* Top Users By Revenue Widget */}
          <TopUsersByRevenue
            className="col-span-12 xl:col-span-7"
          />
        </div>
      </>
    </ProtectedRoute>
  );
}
