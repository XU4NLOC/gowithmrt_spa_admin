"use client";

import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { processChartData, ChartDisplayVersion } from "@/lib/chart-utils";

export type RevenueGrowthDataPoint = {
  x: string; // Date (e.g., "2024-01-15")
  y: number; // Revenue for the day
};

type PropsType = {
  data: RevenueGrowthDataPoint[];
  periodType?: string;
  displayVersion?: ChartDisplayVersion;
};

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export function RevenueGrowthChart({ data, periodType, displayVersion = 'v2' }: PropsType) {
  // Handle loading state when data is not yet available
  if (!data || data.length === 0) {
    return (
      <div className="-ml-3.5 px-6 pb-1 pt-7.5 flex items-center justify-center h-[300px]">
        <div className="text-gray-500 dark:text-gray-400">Loading chart data...</div>
      </div>
    );
  }

  // Process data to optimize label display for 30-day periods
  const chartProcessingResult = processChartData(data, periodType, displayVersion);
  const processedData = chartProcessingResult.processedData || [];
  const processedCategories = chartProcessingResult.processedCategories || [];
  const useRotatedLabels = chartProcessingResult.useRotatedLabels || false;

  const options: ApexOptions = {
    colors: ["#F59E42"], // Orange color for revenue
    chart: {
      fontFamily: "Satoshi, sans-serif",
      type: "line",
      height: 300,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: processedCategories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        rotate: periodType === '30_days' ? -45 : -45,
        rotateAlways: true,
        trim: false,
        style: {
          fontSize: periodType === '30_days' ? "9px" : "12px",
          fontFamily: "Satoshi, sans-serif",
          fontWeight: periodType === '30_days' ? "400" : "normal",
        },
        maxHeight: periodType === '30_days' ? 80 : 60,
        hideOverlappingLabels: false,
        offsetY: 0,
        offsetX: 0,
      },
    },
    yaxis: {
      title: {
        text: "Revenue (VND)",
      },
    },
    grid: {
      strokeDashArray: 7,
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    tooltip: {
      y: {
        formatter: (val) => {
          // Format for Vietnamese context: use English compact notation with VND
          const formatter = new Intl.NumberFormat("en-US", {
            notation: "compact",
            compactDisplay: "short",
          });
          return formatter.format(val) + " VND";
        },
      },
    },
  };

  return (
    <div className="-ml-3.5 px-6 pb-1 pt-7.5">
      <Chart
        options={options}
        series={[
          {
            name: "Revenue",
            data: processedData.map((item) => item.y),
          },
        ]}
        type="line"
        height={300}
      />
    </div>
  );
} 