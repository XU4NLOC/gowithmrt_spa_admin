import { API_ENDPOINTS } from '@/config/api';

// Types for the new unified dashboard API
export type PeriodType = '7_days' | '30_days' | '4_quarters' | '12_months';

export interface DashboardColumn {
  label: string;
  startDate: string;
  endDate: string;
  value: number;
  dayCount: number;
}

export interface DashboardMetric {
  total: number;
  label: string;
  columns: DashboardColumn[];
}

export interface DashboardData {
  periodType: PeriodType;
  periodLabel: string;
  startDate: string;
  endDate: string;
  metrics: {
    userGrowth: DashboardMetric;
    transactionGrowth: DashboardMetric;
    revenueGrowth: DashboardMetric;
  };
  queryPerformanceMs: number;
  generatedAt: number;
}

export interface DashboardApiResponse {
  message: string;
  periodType: PeriodType;
  data: DashboardData;
}

/**
 * Fetch unified dashboard data for all metrics in a single API call
 * @param periodType - The period type to fetch data for
 * @param endDate - Optional end date (defaults to yesterday for complete days)
 * @param accessToken - Optional access token for authentication
 * @returns Promise<DashboardData>
 */
export async function getDashboardData(
  periodType: PeriodType,
  endDate?: string,
  accessToken?: string
): Promise<DashboardData> {
  try {
    const url = new URL(API_ENDPOINTS.admin.analytics.dashboard);
    url.searchParams.set('periodType', periodType);
    if (endDate) {
      url.searchParams.set('endDate', endDate);
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const response = await fetch(url.toString(), { headers });

    if (!response.ok) {
      if (response.status === 401 && typeof window !== 'undefined') {
        window.dispatchEvent(new Event('session-expired'));
      }
      
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch {
        // If we can't parse the error response, use the default message
      }
      
      throw new Error(errorMessage);
    }

    const result: DashboardApiResponse = await response.json();
    return result.data;

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    
    // Fallback to mock data if API fails
    const mockData: DashboardData = {
      periodType,
      periodLabel: getPeriodLabel(periodType),
      startDate: getMockStartDate(periodType),
      endDate: getMockEndDate(periodType),
      metrics: {
        userGrowth: {
          total: getMockTotal('user', periodType),
          label: 'New Users This Period',
          columns: getMockColumns('user', periodType)
        },
        transactionGrowth: {
          total: getMockTotal('transaction', periodType),
          label: 'Completed Transactions This Period',
          columns: getMockColumns('transaction', periodType)
        },
        revenueGrowth: {
          total: getMockTotal('revenue', periodType),
          label: 'Revenue This Period',
          columns: getMockColumns('revenue', periodType)
        }
      },
      queryPerformanceMs: 150,
      generatedAt: Date.now()
    };

    return mockData;
  }
}

// Helper functions for mock data
function getPeriodLabel(periodType: PeriodType): string {
  switch (periodType) {
    case '7_days': return 'Last 7 Days';
    case '30_days': return 'Last 30 Days';
    case '4_quarters': return 'Last 4 Quarters';
    case '12_months': return 'Last 12 Months';
    default: return 'Custom Period';
  }
}

function getMockStartDate(periodType: PeriodType): string {
  const today = new Date();
  switch (periodType) {
    case '7_days':
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7);
      return sevenDaysAgo.toISOString().split('T')[0];
    case '30_days':
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(today.getDate() - 30);
      return thirtyDaysAgo.toISOString().split('T')[0];
    case '4_quarters':
      const fourQuartersAgo = new Date(today);
      fourQuartersAgo.setMonth(today.getMonth() - 12);
      return fourQuartersAgo.toISOString().split('T')[0];
    case '12_months':
      const twelveMonthsAgo = new Date(today);
      twelveMonthsAgo.setMonth(today.getMonth() - 12);
      return twelveMonthsAgo.toISOString().split('T')[0];
    default:
      return today.toISOString().split('T')[0];
  }
}

function getMockEndDate(periodType: PeriodType): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
}

function getMockTotal(metric: 'user' | 'transaction' | 'revenue', periodType: PeriodType): number {
  const baseValues = {
    user: { '7_days': 23, '30_days': 87, '4_quarters': 450, '12_months': 340 },
    transaction: { '7_days': 61, '30_days': 234, '4_quarters': 1250, '12_months': 980 },
    revenue: { '7_days': 1500000, '30_days': 5800000, '4_quarters': 25000000, '12_months': 18500000 }
  };
  return baseValues[metric][periodType] || 0;
}

function getMockColumns(metric: 'user' | 'transaction' | 'revenue', periodType: PeriodType): DashboardColumn[] {
  const today = new Date();
  const columns: DashboardColumn[] = [];
  
  if (periodType === '7_days') {
    const baseValues = {
      user: [3, 4, 2, 5, 1, 6, 2],
      transaction: [8, 12, 7, 15, 5, 9, 5],
      revenue: [200000, 350000, 180000, 420000, 120000, 150000, 80000]
    };
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i - 1);
      const dateStr = date.toISOString().split('T')[0];
      
      columns.push({
        label: date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
        startDate: dateStr,
        endDate: dateStr,
        value: baseValues[metric][6 - i],
        dayCount: 1
      });
    }
  } else if (periodType === '30_days') {
    const baseValues = {
      user: 87,
      transaction: 234,
      revenue: 5800000
    };
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i - 1);
      const dateStr = date.toISOString().split('T')[0];
      
      columns.push({
        label: date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
        startDate: dateStr,
        endDate: dateStr,
        value: Math.floor((baseValues[metric] / 30) * (0.5 + Math.random())),
        dayCount: 1
      });
    }
  } else if (periodType === '4_quarters') {
    const baseValues = {
      user: [120, 135, 95, 100],
      transaction: [300, 350, 250, 350],
      revenue: [6000000, 7000000, 5500000, 6500000]
    };
    
    const quarters = ['Q4 2024', 'Q1 2025', 'Q2 2025', 'Q3 2025'];
    quarters.forEach((quarter, index) => {
      const startDate = getQuarterStartDate(quarter);
      const endDate = getQuarterEndDate(quarter);
      
      columns.push({
        label: quarter,
        startDate,
        endDate,
        value: baseValues[metric][index],
        dayCount: 90
      });
    });
  } else if (periodType === '12_months') {
    const baseValues = {
      user: 340,
      transaction: 980,
      revenue: 18500000
    };
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(today);
      date.setMonth(today.getMonth() - i);
      date.setDate(1);
      
      const endDate = new Date(date);
      endDate.setMonth(date.getMonth() + 1);
      endDate.setDate(0);
      
      columns.push({
        label: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        startDate: date.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        value: Math.floor((baseValues[metric] / 12) * (0.7 + Math.random() * 0.6)),
        dayCount: endDate.getDate()
      });
    }
  }
  
  return columns;
}

function getQuarterStartDate(quarter: string): string {
  const [q, year] = quarter.split(' ');
  const yearNum = parseInt(year);
  const quarterNum = parseInt(q.replace('Q', ''));
  
  const month = (quarterNum - 1) * 3;
  return new Date(yearNum, month, 1).toISOString().split('T')[0];
}

function getQuarterEndDate(quarter: string): string {
  const [q, year] = quarter.split(' ');
  const yearNum = parseInt(year);
  const quarterNum = parseInt(q.replace('Q', ''));
  
  const month = quarterNum * 3;
  return new Date(yearNum, month, 0).toISOString().split('T')[0];
}

export async function getDevicesUsedData(
  timeFrame?: "monthly" | "yearly" | (string & {}),
) {
  // Fake delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const data = [
    {
      name: "Desktop",
      percentage: 0.65,
      amount: 1625,
    },
    {
      name: "Tablet",
      percentage: 0.1,
      amount: 250,
    },
    {
      name: "Mobile",
      percentage: 0.2,
      amount: 500,
    },
    {
      name: "Unknown",
      percentage: 0.05,
      amount: 125,
    },
  ];

  if (timeFrame === "yearly") {
    data[0].amount = 19500;
    data[1].amount = 3000;
    data[2].amount = 6000;
    data[3].amount = 1500;
  }

  return data;
}

export async function getPaymentsOverviewData(
  timeFrame?: "monthly" | "yearly" | (string & {}),
) {
  // Fake delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (timeFrame === "yearly") {
    return {
      received: [
        { x: 2020, y: 450 },
        { x: 2021, y: 620 },
        { x: 2022, y: 780 },
        { x: 2023, y: 920 },
        { x: 2024, y: 1080 },
      ],
      due: [
        { x: 2020, y: 1480 },
        { x: 2021, y: 1720 },
        { x: 2022, y: 1950 },
        { x: 2023, y: 2300 },
        { x: 2024, y: 1200 },
      ],
    };
  }

  return {
    received: [
      { x: "Jan", y: 0 },
      { x: "Feb", y: 20 },
      { x: "Mar", y: 35 },
      { x: "Apr", y: 45 },
      { x: "May", y: 35 },
      { x: "Jun", y: 55 },
      { x: "Jul", y: 65 },
      { x: "Aug", y: 50 },
      { x: "Sep", y: 65 },
      { x: "Oct", y: 75 },
      { x: "Nov", y: 60 },
      { x: "Dec", y: 75 },
    ],
    due: [
      { x: "Jan", y: 15 },
      { x: "Feb", y: 9 },
      { x: "Mar", y: 17 },
      { x: "Apr", y: 32 },
      { x: "May", y: 25 },
      { x: "Jun", y: 68 },
      { x: "Jul", y: 80 },
      { x: "Aug", y: 68 },
      { x: "Sep", y: 84 },
      { x: "Oct", y: 94 },
      { x: "Nov", y: 74 },
      { x: "Dec", y: 62 },
    ],
  };
}

export async function getWeeksProfitData(timeFrame?: string) {
  // Fake delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (timeFrame === "last week") {
    return {
      sales: [
        { x: "Sat", y: 33 },
        { x: "Sun", y: 44 },
        { x: "Mon", y: 31 },
        { x: "Tue", y: 57 },
        { x: "Wed", y: 12 },
        { x: "Thu", y: 33 },
        { x: "Fri", y: 55 },
      ],
      revenue: [
        { x: "Sat", y: 10 },
        { x: "Sun", y: 20 },
        { x: "Mon", y: 17 },
        { x: "Tue", y: 7 },
        { x: "Wed", y: 10 },
        { x: "Thu", y: 23 },
        { x: "Fri", y: 13 },
      ],
    };
  }

  return {
    sales: [
      { x: "Sat", y: 44 },
      { x: "Sun", y: 55 },
      { x: "Mon", y: 41 },
      { x: "Tue", y: 67 },
      { x: "Wed", y: 22 },
      { x: "Thu", y: 43 },
      { x: "Fri", y: 65 },
    ],
    revenue: [
      { x: "Sat", y: 13 },
      { x: "Sun", y: 23 },
      { x: "Mon", y: 20 },
      { x: "Tue", y: 8 },
      { x: "Wed", y: 13 },
      { x: "Thu", y: 27 },
      { x: "Fri", y: 15 },
    ],
  };
}

export async function getCampaignVisitorsData() {
  // Fake delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    total_visitors: 784_000,
    performance: -1.5,
    chart: [
      { x: "S", y: 168 },
      { x: "S", y: 385 },
      { x: "M", y: 201 },
      { x: "T", y: 298 },
      { x: "W", y: 187 },
      { x: "T", y: 195 },
      { x: "F", y: 291 },
    ],
  };
}

export async function getVisitorsAnalyticsData() {
  // Fake delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return [
    168, 385, 201, 298, 187, 195, 291, 110, 215, 390, 280, 112, 123, 212, 270,
    190, 310, 115, 90, 380, 112, 223, 292, 170, 290, 110, 115, 290, 380, 312,
  ].map((value, index) => ({ x: index + 1 + "", y: value }));
}

export async function getCostsPerInteractionData() {
  return {
    avg_cost: 560.93,
    growth: 2.5,
    chart: [
      {
        name: "Google Ads",
        data: [
          { x: "Sep", y: 15 },
          { x: "Oct", y: 12 },
          { x: "Nov", y: 61 },
          { x: "Dec", y: 118 },
          { x: "Jan", y: 78 },
          { x: "Feb", y: 125 },
          { x: "Mar", y: 165 },
          { x: "Apr", y: 61 },
          { x: "May", y: 183 },
          { x: "Jun", y: 238 },
          { x: "Jul", y: 237 },
          { x: "Aug", y: 235 },
        ],
      },
      {
        name: "Facebook Ads",
        data: [
          { x: "Sep", y: 75 },
          { x: "Oct", y: 77 },
          { x: "Nov", y: 151 },
          { x: "Dec", y: 72 },
          { x: "Jan", y: 7 },
          { x: "Feb", y: 58 },
          { x: "Mar", y: 60 },
          { x: "Apr", y: 185 },
          { x: "May", y: 239 },
          { x: "Jun", y: 135 },
          { x: "Jul", y: 119 },
          { x: "Aug", y: 124 },
        ],
      },
    ],
  };
}

export async function getUserGrowthData(
  timeFrame?: "daily" | "weekly" | "monthly" | (string & {}),
  accessToken?: string
) {
  try {
    const baseUrl = API_ENDPOINTS.admin.analytics.userGrowth;
    const headers: Record<string, string> = { 
      'Content-Type': 'application/json' 
    };
    
    // Add authorization header if accessToken is provided
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    // Determine days based on timeFrame
    let days = 30; // default to 30 days to get more data
    if (timeFrame === "daily") days = 7;
    else if (timeFrame === "weekly") days = 30;
    else if (timeFrame === "monthly") days = 90;
    else if (timeFrame === "yearly") days = 365;

    // Fetch daily data and summary data in parallel
    const [dailyResponse, summaryResponse] = await Promise.all([
      fetch(`${baseUrl}/daily?days=${days}`, { headers }),
      fetch(`${baseUrl}/summary`, { headers })
    ]);

    if (!dailyResponse.ok) {
      if (dailyResponse.status === 401 && typeof window !== 'undefined') {
        window.dispatchEvent(new Event('session-expired'));
      }
      throw new Error(`Failed to fetch daily data: ${dailyResponse.status}`);
    }
    if (!summaryResponse.ok) {
      if (summaryResponse.status === 401 && typeof window !== 'undefined') {
        window.dispatchEvent(new Event('session-expired'));
      }
      throw new Error(`Failed to fetch summary data: ${summaryResponse.status}`);
    }

    const dailyData = await dailyResponse.json();
    const summaryData = await summaryResponse.json();

    // Transform API data to match expected format
    const chartData = dailyData.data.map((item: any) => ({
      x: item.date,
      y: item.newUsers
    }));

    // Calculate total new users from actual data
    const totalNewUsers = chartData.reduce((sum: number, item: any) => sum + item.y, 0);

    return {
      total_new_users: totalNewUsers,
      chart: chartData,
    };

  } catch (error) {
    console.error('Error fetching user growth data:', error);
    
    // Fallback to mock data if API fails
    const mockData = [
      { x: "2024-01-01", y: 45 },
      { x: "2024-01-02", y: 52 },
      { x: "2024-01-03", y: 38 },
      { x: "2024-01-04", y: 67 },
      { x: "2024-01-05", y: 73 },
      { x: "2024-01-06", y: 89 },
      { x: "2024-01-07", y: 94 },
    ];

    return {
      total_new_users: mockData.reduce((sum, item) => sum + item.y, 0),
      chart: mockData,
    };
  }
}

export async function getTransactionsGrowthData(
  timeFrame?: "daily" | "weekly" | "monthly" | (string & {}),
  accessToken?: string
) {
  try {
    const baseUrl = API_ENDPOINTS.admin.analytics.transactionGrowth;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    // Determine days based on timeFrame
    let days = 30; // default to 30 days
    if (timeFrame === "daily") days = 7;
    else if (timeFrame === "weekly") days = 30;
    else if (timeFrame === "monthly") days = 90;
    else if (timeFrame === "yearly") days = 365;

    const response = await fetch(`${baseUrl}/daily?days=${days}`, { headers });
    if (!response.ok) {
      if (response.status === 401 && typeof window !== 'undefined') {
        window.dispatchEvent(new Event('session-expired'));
      }
      throw new Error(`Failed to fetch transaction growth data: ${response.status}`);
    }
    const data = await response.json();
    const chartData = data.data.map((item: any) => ({
      x: item.date,
      y: item.newTransactions
    }));
    const totalTransactions = chartData.reduce((sum: number, item: any) => sum + item.y, 0);
    return {
      total_transactions: totalTransactions,
      chart: chartData,
    };
  } catch (error) {
    console.error('Error fetching transaction growth data:', error);
    // Fallback to mock data if API fails
    const mockData = [
      { x: "2024-01-01", y: 120 },
      { x: "2024-01-02", y: 135 },
      { x: "2024-01-03", y: 110 },
      { x: "2024-01-04", y: 150 },
      { x: "2024-01-05", y: 170 },
      { x: "2024-01-06", y: 160 },
      { x: "2024-01-07", y: 180 },
    ];
    return {
      total_transactions: mockData.reduce((sum, item) => sum + item.y, 0),
      chart: mockData,
    };
  }
}

export async function getTransactionGrowthSummary(accessToken?: string) {
  try {
    const baseUrl = API_ENDPOINTS.admin.analytics.transactionGrowth;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
    const response = await fetch(`${baseUrl}/summary`, { headers });
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(`Failed to fetch transaction growth summary: ${response.status} - ${errorText}`);
    }
    const result = await response.json();
    return result.summary;
  } catch (error) {
    console.error('Error fetching transaction growth summary:', error);
    return {
      currentTotalTransactions: 0,
      totalNewTransactionsLast7Days: 0,
      totalNewTransactionsLast30Days: 0,
      avgNewTransactionsPerDayLast7Days: 0,
      avgNewTransactionsPerDayLast30Days: 0,
      bestDayLast30Days: null,
      last7DaysData: [],
      generatedAt: new Date().toISOString(),
    } as any;
  }
}

export async function getRevenueGrowthData(
  timeFrame?: "daily" | "weekly" | "monthly" | (string & {}),
  accessToken?: string
) {
  try {
    const baseUrl = API_ENDPOINTS.admin.analytics.revenueGrowth;
    const headers: Record<string, string> = { 
      'Content-Type': 'application/json' 
    };
    
    // Add authorization header if accessToken is provided
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    // Determine days based on timeFrame
    let days = 30; // default to 30 days to get more data
    if (timeFrame === "daily") days = 7;
    else if (timeFrame === "weekly") days = 30;
    else if (timeFrame === "monthly") days = 90;
    else if (timeFrame === "yearly") days = 365;

    // Fetch daily data and summary data in parallel
    const [dailyResponse, summaryResponse] = await Promise.all([
      fetch(`${baseUrl}/daily?days=${days}`, { headers }),
      fetch(`${baseUrl}/summary`, { headers })
    ]);

    if (!dailyResponse.ok) {
      if (dailyResponse.status === 401 && typeof window !== 'undefined') {
        window.dispatchEvent(new Event('session-expired'));
      }
      throw new Error(`Failed to fetch daily data: ${dailyResponse.status}`);
    }
    if (!summaryResponse.ok) {
      if (summaryResponse.status === 401 && typeof window !== 'undefined') {
        window.dispatchEvent(new Event('session-expired'));
      }
      throw new Error(`Failed to fetch summary data: ${summaryResponse.status}`);
    }

    const dailyData = await dailyResponse.json();
    const summaryData = await summaryResponse.json();

    // Transform API data to match expected format
    const chartData = dailyData.data.map((item: any) => ({
      x: item.date,
      y: item.dailyRevenue
    }));

    // Calculate total revenue from actual data
    const totalRevenue = chartData.reduce((sum: number, item: any) => sum + item.y, 0);

    return {
      total_revenue: totalRevenue,
      chart: chartData,
    };

  } catch (error) {
    console.error('Error fetching revenue growth data:', error);
    
    // Fallback to mock data if API fails
    const mockData = [
      { x: "2024-01-01", y: 1750000 },
      { x: "2024-01-02", y: 2100000 },
      { x: "2024-01-03", y: 1950000 },
      { x: "2024-01-04", y: 2650000 },
      { x: "2024-01-05", y: 2200000 },
      { x: "2024-01-06", y: 2450000 },
      { x: "2024-01-07", y: 2850000 },
    ];

    return {
      total_revenue: mockData.reduce((sum, item) => sum + item.y, 0),
      chart: mockData,
    };
  }
}

export async function getRevenueGrowthSummary(accessToken?: string) {
  try {
    const baseUrl = API_ENDPOINTS.admin.analytics.revenueGrowth;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
    const response = await fetch(`${baseUrl}/summary`, { headers });
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(`Failed to fetch revenue growth summary: ${response.status} - ${errorText}`);
    }
    const result = await response.json();
    return result.summary;
  } catch (error) {
    console.error('Error fetching revenue growth summary:', error);
    return {
      currentTotalRevenue: 0,
      totalRevenueLast7Days: 0,
      totalRevenueLast30Days: 0,
      avgRevenuePerDayLast7Days: 0,
      avgRevenuePerDayLast30Days: 0,
      avgRevenuePerTransactionLast7Days: 0,
      avgRevenuePerTransactionLast30Days: 0,
      bestDayLast30Days: null,
      last7DaysData: [],
      currency: "VND",
      generatedAt: new Date().toISOString(),
      lastCalculated: new Date().toISOString()
    } as any;
  }
}

// Helper function to generate period-responsive mock data for top users
function getMockTopUsersByRevenue(timeFrame?: string) {
  const baseUsers = [
    { name: "Bao Do", baseRevenue: 2850000 },
    { name: "Minsung Kim", baseRevenue: 2650000 },
    { name: "Thanh Do", baseRevenue: 2420000 },
    { name: "Loc Le", baseRevenue: 2180000 },
    { name: "Yeeun Han", baseRevenue: 1950000 },
    { name: "Sung Kim", baseRevenue: 1720000 },
    { name: "Brian Do", baseRevenue: 1580000 },
    { name: "Sarah Nguyen", baseRevenue: 1450000 },
    { name: "Mike Tran", baseRevenue: 1320000 },
    { name: "Lisa Pham", baseRevenue: 1180000 },
  ];

  // Adjust revenue and user count based on period type
  let multiplier = 1;
  let baseGroupCount = 15;
  let userCount = 10; // Number of users with revenue in this period
  
  switch (timeFrame) {
    case "7_days":
    case "daily":
      multiplier = 0.2; // ~20% of full revenue for 7 days
      baseGroupCount = 3;
      userCount = 5; // Only 5 users made transactions in 7 days
      break;
    case "30_days":
    case "weekly":
      multiplier = 0.6; // ~60% of full revenue for 30 days
      baseGroupCount = 8;
      userCount = 8; // 8 users made transactions in 30 days
      break;
    case "4_quarters":
    case "yearly":
      multiplier = 1.5; // 150% for quarterly view (more historical data)
      baseGroupCount = 20;
      userCount = 10; // Full 10 users for quarterly view
      break;
    case "12_months":
    case "monthly":
      multiplier = 1.2; // 120% for 12 months
      baseGroupCount = 18;
      userCount = 10; // Full 10 users for 12 months
      break;
    default:
      multiplier = 0.8;
      baseGroupCount = 12;
      userCount = 7; // Default to 7 users
  }

  // Return only the specified number of users
  return baseUsers.slice(0, userCount).map((user, index) => {
    const adjustedRevenue = Math.floor(user.baseRevenue * multiplier * (0.8 + Math.random() * 0.4));
    const groupCount = Math.max(1, Math.floor(baseGroupCount * (0.7 + Math.random() * 0.6)));
    
    return {
      name: user.name,
      revenue: adjustedRevenue,
      rank: index + 1,
      groupCount,
      avgRevenuePerGroup: Math.floor(adjustedRevenue / groupCount)
    };
  });
}

export async function getTopUsersByRevenue(
  timeFrame?: "daily" | "weekly" | "monthly" | "yearly" | PeriodType | (string & {}),
  accessToken?: string
) {
  try {
    const baseUrl = API_ENDPOINTS.admin.analytics.revenueGrowth;
    const headers: Record<string, string> = { 
      'Content-Type': 'application/json' 
    };
    
    // Add authorization header if accessToken is provided
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    let endpoint = `${baseUrl}/top-users?limit=10`;
    
    // If timeFrame is provided, use date range endpoint
    if (timeFrame) {
      const endDate = new Date();
      const startDate = new Date();
      
      // Calculate start date based on timeFrame
      switch (timeFrame) {
        // Legacy timeFrame values
        case "daily":
          startDate.setDate(endDate.getDate() - 7);
          break;
        case "weekly":
          startDate.setDate(endDate.getDate() - 30);
          break;
        case "monthly":
          startDate.setDate(endDate.getDate() - 90);
          break;
        case "yearly":
          startDate.setDate(endDate.getDate() - 365);
          break;
        // New PeriodType values
        case "7_days":
          startDate.setDate(endDate.getDate() - 7);
          break;
        case "30_days":
          startDate.setDate(endDate.getDate() - 30);
          break;
        case "4_quarters":
          startDate.setMonth(endDate.getMonth() - 12);
          break;
        case "12_months":
          startDate.setMonth(endDate.getMonth() - 12);
          break;
        default:
          startDate.setDate(endDate.getDate() - 30);
      }
      
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];
      
      endpoint = `${baseUrl}/top-users/range?startDate=${startDateStr}&endDate=${endDateStr}&limit=10`;
    }

    console.log('Fetching top users by revenue from:', endpoint);
    const response = await fetch(endpoint, { headers });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error(`Top users API error ${response.status}:`, errorText);
      if (response.status === 401 && typeof window !== 'undefined') {
        window.dispatchEvent(new Event('session-expired'));
      }
      throw new Error(`Failed to fetch top users: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Top users API response:', result);
    
    // Transform API data to match expected format
    const userData = result.data.map((item: any) => ({
      name: item.displayName,
      revenue: item.totalRevenue,
      rank: item.rank,
      groupCount: item.groupCount,
      avgRevenuePerGroup: item.avgRevenuePerGroup
    }));

    return userData;

  } catch (error) {
    console.error('Error fetching top users by revenue data:', error);
    
    // Fallback to period-responsive mock data
    return getMockTopUsersByRevenue(timeFrame);
  }
}

export async function getBenThanhGateDistribution(
  timeFrame?: "daily" | "weekly" | "monthly" | "yearly" | PeriodType | (string & {}),
  accessToken?: string
) {
  try {
    const baseUrl = API_ENDPOINTS.admin.analytics.gateDistribution;
    const headers: Record<string, string> = { 
      'Content-Type': 'application/json' 
    };
    
    // Add authorization header if accessToken is provided
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    // Use the summary endpoint as recommended by backend team
    const endpoint = `${baseUrl}/summary`;

    console.log('Fetching gate distribution summary from:', endpoint);
    const response = await fetch(endpoint, { headers });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error(`Gate distribution API error ${response.status}:`, errorText);
      if (response.status === 401 && typeof window !== 'undefined') {
        window.dispatchEvent(new Event('session-expired'));
      }
      throw new Error(`Failed to fetch gate distribution: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Gate distribution API response:', result);
    
    // Transform API data from summary endpoint to match expected format
    const gateData = result.summary.gateDistribution.map((item: any) => ({
      gate: item.gate,
      count: item.count,
      percentage: item.percentage
    }));

    return gateData;

  } catch (error) {
    console.error('Error fetching gate distribution data:', error);
    
    // Fallback to period-responsive mock data
    return getMockBenThanhGateDistribution(timeFrame);
  }
}

// Helper function to generate period-responsive mock data for gate distribution
function getMockBenThanhGateDistribution(timeFrame?: string) {
  const baseGates = [
    { gate: "Gate 1", baseCount: 120, basePercentage: 20.0 },
    { gate: "Gate 2", baseCount: 80, basePercentage: 13.33 },
    { gate: "Gate 3", baseCount: 150, basePercentage: 25.0 },
    { gate: "Gate 4", baseCount: 60, basePercentage: 10.0 },
    { gate: "Gate 5", baseCount: 90, basePercentage: 15.0 },
    { gate: "Gate 6", baseCount: 100, basePercentage: 16.67 },
  ];

  // Adjust counts based on period type to simulate different usage patterns
  let multiplier = 1;
  let distributionShift = 0; // Shift in percentage distribution
  
  switch (timeFrame) {
    case "7_days":
    case "daily":
      multiplier = 0.3; // Lower usage in short period
      distributionShift = 0.05; // Slight shift in distribution
      break;
    case "30_days":
    case "weekly":
      multiplier = 0.7; // Moderate usage
      distributionShift = 0.03;
      break;
    case "4_quarters":
    case "yearly":
      multiplier = 1.8; // Higher usage over quarters
      distributionShift = -0.02; // Different pattern
      break;
    case "12_months":
    case "monthly":
      multiplier = 1.5; // Higher usage over months
      distributionShift = -0.01;
      break;
    default:
      multiplier = 1.0;
      distributionShift = 0;
  }

  // Apply multiplier and add some randomness
  const adjustedGates = baseGates.map((gate, index) => {
    const randomFactor = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
    const count = Math.floor(gate.baseCount * multiplier * randomFactor);
    
    // Adjust percentages with some variation
    let percentage = gate.basePercentage + (distributionShift * 100 * (index % 2 === 0 ? 1 : -1));
    percentage = Math.max(5, Math.min(35, percentage)); // Keep within reasonable bounds
    
    return {
      gate: gate.gate,
      count,
      percentage: Math.round(percentage * 100) / 100
    };
  });

  // Normalize percentages to ensure they sum to 100%
  const totalPercentage = adjustedGates.reduce((sum, gate) => sum + gate.percentage, 0);
  const normalizedGates = adjustedGates.map(gate => ({
    ...gate,
    percentage: Math.round((gate.percentage / totalPercentage * 100) * 100) / 100
  }));

  return normalizedGates;
}

export async function getUserGrowthSummary(accessToken?: string) {
  try {
    const baseUrl = API_ENDPOINTS.admin.analytics.userGrowth;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
    const response = await fetch(`${baseUrl}/summary`, { headers });
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(`Failed to fetch user growth summary: ${response.status} - ${errorText}`);
    }
    const result = await response.json();
    return result.summary;
  } catch (error) {
    console.error('Error fetching user growth summary:', error);
    // Sensible fallback
    return {
      currentTotalUsers: 0,
      totalNewUsersLast7Days: 0,
      totalNewUsersLast30Days: 0,
      avgNewUsersPerDayLast7Days: 0,
      avgNewUsersPerDayLast30Days: 0,
      bestDayLast30Days: null,
      last7DaysData: [],
      generatedAt: new Date().toISOString(),
    } as any;
  }
}