"use client";

import { ChevronUpIcon } from "@/assets/icons";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Dropdown, DropdownContent, DropdownTrigger } from "./ui/dropdown";
import { PeriodType } from "@/services/charts.services";

const PARAM_KEY = "selected_time_frame";

type PropsType<TItem> = {
  defaultValue?: TItem;
  items?: TItem[];
  minimal?: boolean;
  // New props for unified period picker
  onPeriodChange?: (period: PeriodType) => void;
  selectedPeriod?: PeriodType;
  useDashboardPeriods?: boolean;
};

// Period type mappings
const DASHBOARD_PERIODS: Array<{ value: PeriodType; label: string }> = [
  { value: '7_days', label: '7 Days' },
  { value: '30_days', label: '30 Days' },
  { value: '4_quarters', label: '4 Quarters' },
  { value: '12_months', label: '12 Months' }
];

function getSingleValue(val: string | undefined): string | undefined {
  if (!val) return undefined;
  return val.split(",")[0].split(":").pop();
}

function getPeriodLabel(period: PeriodType): string {
  const found = DASHBOARD_PERIODS.find(p => p.value === period);
  return found ? found.label : period;
}

export function PeriodPicker<TItem extends string>({
  defaultValue,
  items,
  minimal,
  onPeriodChange,
  selectedPeriod,
  useDashboardPeriods = false,
}: PropsType<TItem>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  // Legacy mode (original functionality)
  const paramValue = getSingleValue(searchParams.get(PARAM_KEY) || undefined);
  const pickerValue = getSingleValue(defaultValue) || paramValue || "monthly";

  // New dashboard mode
  const dashboardValue = selectedPeriod || '7_days';

  // Determine which periods and value to use
  const periodsToShow = useDashboardPeriods ? DASHBOARD_PERIODS : (items || ["monthly", "yearly"]).map(item => ({ value: item as any, label: item }));
  const currentValue = useDashboardPeriods ? getPeriodLabel(dashboardValue) : (pickerValue || "Time Period");

  const handleItemClick = (item: any) => {
    if (useDashboardPeriods && onPeriodChange) {
      // New dashboard mode - use callback
      onPeriodChange(item.value as PeriodType);
    } else {
      // Legacy mode - use URL params
      const queryString = `?${PARAM_KEY}=${item.value || item}`;
      router.push(pathname + queryString, {
        scroll: false,
      });
    }
    setIsOpen(false);
  };

  return (
    <Dropdown isOpen={isOpen} setIsOpen={setIsOpen}>
      <DropdownTrigger
        className={cn(
          "flex h-8 w-full items-center justify-between gap-x-1 rounded-md border border-[#E8E8E8] bg-white px-3 py-2 text-sm font-medium text-dark-5 outline-none ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:text-neutral-500 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:ring-offset-neutral-950 dark:focus:ring-neutral-300 dark:data-[placeholder]:text-neutral-400 [&>span]:line-clamp-1 [&[data-state='open']>svg]:rotate-0",
          minimal &&
            "border-none bg-transparent p-0 text-dark dark:bg-transparent dark:text-white",
        )}
      >
        <span className={useDashboardPeriods ? "" : "capitalize"}>{currentValue}</span>
        <ChevronUpIcon className="size-4 rotate-180 transition-transform" />
      </DropdownTrigger>
      <DropdownContent
        align="end"
        className="min-w-[7rem] overflow-hidden rounded-lg border border-[#E8E8E8] bg-white p-1 font-medium text-dark-5 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-dark-3 dark:bg-dark-2 dark:text-current"
      >
        <ul>
          {periodsToShow.map((item) => (
            <li key={item.value}>
              <button
                className="flex w-full select-none items-center truncate rounded-md px-3 py-2 text-sm outline-none hover:bg-[#F9FAFB] hover:text-dark-3 dark:hover:bg-[#FFFFFF1A] dark:hover:text-white"
                onClick={() => handleItemClick(item)}
              >
                <span className={useDashboardPeriods ? "" : "capitalize"}>
                  {item.label}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </DropdownContent>
    </Dropdown>
  );
}