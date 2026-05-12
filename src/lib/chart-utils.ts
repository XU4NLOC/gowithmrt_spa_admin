// Utility functions for chart data processing

export interface ChartDataPoint {
  x: string;
  y: number;
}

/**
 * Filters chart labels to show consistent 2-day intervals for 30-day period
 * Keeps all 30 data points but only shows every 2nd day as label to prevent overlap
 * Ensures odd/even pattern consistency based on the latest date
 */
export function filterChartLabelsFor30Days(data: ChartDataPoint[]): {
  filteredData: ChartDataPoint[];
  filteredCategories: string[];
} {
  // Handle edge cases
  if (!data || !Array.isArray(data) || data.length === 0) {
    return {
      filteredData: [],
      filteredCategories: []
    };
  }

  if (data.length !== 30) {
    // Not a 30-day dataset, return as-is
    return {
      filteredData: data,
      filteredCategories: data.map(item => item.x)
    };
  }

  // Get the latest date (last item in the array)
  const latestDateStr = data[data.length - 1].x;
  
  // Parse the latest date to determine if it's odd or even
  const latestDate = new Date(latestDateStr + 'T00:00:00');
  const latestDay = latestDate.getDate();
  const isLatestOdd = latestDay % 2 === 1;

  // Keep all data points but create filtered labels for display
  const filteredCategories: string[] = [];

  // Work through all data points to create labels
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const dateStr = item.x;
    
    // Parse the date from the label (format: "Sep 02", "Sep 04", etc.)
    let dayNum: number;
    
    if (dateStr.includes(' ')) {
      // Format: "Sep 02"
      const parts = dateStr.split(' ');
      dayNum = parseInt(parts[1]);
    } else {
      // Fallback: try to parse as full date
      const date = new Date(dateStr + 'T00:00:00');
      dayNum = date.getDate();
    }

    // Show label only if it matches the odd/even pattern of the latest date
    const shouldShowLabel = isLatestOdd ? (dayNum % 2 === 1) : (dayNum % 2 === 0);
    
    if (shouldShowLabel) {
      filteredCategories.push(dateStr);
    } else {
      filteredCategories.push(''); // Empty string for hidden labels
    }
  }

  return {
    filteredData: data, // Keep all 30 data points
    filteredCategories // Show labels only for every 2nd day
  };
}

/**
 * Chart display version options for 30-day periods
 */
export type ChartDisplayVersion = 'v1' | 'v2';

/**
 * Processes chart data based on period type to optimize label display
 */
export function processChartData(
  data: ChartDataPoint[], 
  periodType?: string,
  displayVersion: ChartDisplayVersion = 'v2' // Default to v2 (show all labels)
): {
  processedData: ChartDataPoint[];
  processedCategories: string[];
  useRotatedLabels?: boolean;
} {
  // Handle edge cases
  if (!data || !Array.isArray(data)) {
    return {
      processedData: [],
      processedCategories: [],
      useRotatedLabels: false
    };
  }

  if (periodType === '30_days') {
    if (displayVersion === 'v1') {
      // Version 1: Filter labels to show every 2nd day
      const result = filterChartLabelsFor30Days(data);
      return {
        processedData: result.filteredData || [],
        processedCategories: result.filteredCategories || [],
        useRotatedLabels: false
      };
    } else {
      // Version 2: Show all labels with rotation
      return {
        processedData: data,
        processedCategories: data.map(item => item?.x || ''),
        useRotatedLabels: true
      };
    }
  }

  // For other period types, return data as-is
  return {
    processedData: data || [],
    processedCategories: (data || []).map(item => item?.x || ''),
    useRotatedLabels: false
  };
}
