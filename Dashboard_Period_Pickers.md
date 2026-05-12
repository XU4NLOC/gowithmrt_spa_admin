# Complete API Documentation - Dashboard Period Pickers

## 📋 **API Overview**

The backend provides optimized endpoints for dashboard period picker functionality. All endpoints return pre-aggregated data to minimize frontend processing and improve performance.

**Base URL:** `/api/admin/analytics`

**Supported Period Types:**
- `7_days` - Last 7 complete days
- `30_days` - Last 30 complete days  
- `4_quarters` - Last 4 quarters from today
- `12_months` - Last 12 calendar months from today

---

## 🚀 **Primary Endpoint (RECOMMENDED)**

### **Unified Dashboard API**

**Endpoint:** `GET /api/admin/analytics/dashboard`

**Description:** Fetches all dashboard metrics (user growth, transaction growth, revenue growth) in a single optimized API call.

**Parameters:**
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `periodType` | string | Yes | Period type identifier | `7_days` |
| `endDate` | string | No | End date in ISO format (defaults to yesterday) | `2025-09-08` |

**Example Requests:**
```bash
GET /api/admin/analytics/dashboard?periodType=7_days
GET /api/admin/analytics/dashboard?periodType=30_days
GET /api/admin/analytics/dashboard?periodType=4_quarters
GET /api/admin/analytics/dashboard?periodType=12_months
GET /api/admin/analytics/dashboard?periodType=7_days&endDate=2025-09-08
```

**JavaScript Usage:**
```javascript
// Fetch 7-day dashboard data
const response = await fetch('/api/admin/analytics/dashboard?periodType=7_days');
const result = await response.json();
const dashboardData = result.data;
```

### **Response Format:**

```json
{
  "message": "Dashboard metrics retrieved successfully",
  "periodType": "7_days",
  "data": {
    "periodType": "7_days",
    "periodLabel": "Last 7 Days",
    "startDate": "2025-09-02",
    "endDate": "2025-09-08",
    "metrics": {
      "userGrowth": {
        "total": 23,
        "label": "New Users This Period",
        "columns": [
          {
            "label": "Sep 02",
            "startDate": "2025-09-02",
            "endDate": "2025-09-02",
            "value": 3,
            "dayCount": 1
          },
          {
            "label": "Sep 03", 
            "startDate": "2025-09-03",
            "endDate": "2025-09-03",
            "value": 4,
            "dayCount": 1
          },
          {
            "label": "Sep 04",
            "startDate": "2025-09-04",
            "endDate": "2025-09-04", 
            "value": 2,
            "dayCount": 1
          },
          {
            "label": "Sep 05",
            "startDate": "2025-09-05",
            "endDate": "2025-09-05",
            "value": 5,
            "dayCount": 1
          },
          {
            "label": "Sep 06",
            "startDate": "2025-09-06",
            "endDate": "2025-09-06",
            "value": 1,
            "dayCount": 1
          },
          {
            "label": "Sep 07",
            "startDate": "2025-09-07",
            "endDate": "2025-09-07",
            "value": 6,
            "dayCount": 1
          },
          {
            "label": "Sep 08",
            "startDate": "2025-09-08",
            "endDate": "2025-09-08",
            "value": 2,
            "dayCount": 1
          }
        ]
      },
      "transactionGrowth": {
        "total": 61,
        "label": "Completed Transactions This Period",
        "columns": [
          {
            "label": "Sep 02",
            "startDate": "2025-09-02",
            "endDate": "2025-09-02",
            "value": 8,
            "dayCount": 1
          },
          {
            "label": "Sep 03",
            "startDate": "2025-09-03", 
            "endDate": "2025-09-03",
            "value": 12,
            "dayCount": 1
          },
          {
            "label": "Sep 04",
            "startDate": "2025-09-04",
            "endDate": "2025-09-04",
            "value": 7,
            "dayCount": 1
          },
          {
            "label": "Sep 05",
            "startDate": "2025-09-05",
            "endDate": "2025-09-05",
            "value": 15,
            "dayCount": 1
          },
          {
            "label": "Sep 06",
            "startDate": "2025-09-06",
            "endDate": "2025-09-06",
            "value": 5,
            "dayCount": 1
          },
          {
            "label": "Sep 07",
            "startDate": "2025-09-07",
            "endDate": "2025-09-07",
            "value": 9,
            "dayCount": 1
          },
          {
            "label": "Sep 08",
            "startDate": "2025-09-08",
            "endDate": "2025-09-08",
            "value": 5,
            "dayCount": 1
          }
        ]
      },
      "revenueGrowth": {
        "total": 1500000,
        "label": "Revenue This Period",
        "columns": [
          {
            "label": "Sep 02",
            "startDate": "2025-09-02",
            "endDate": "2025-09-02",
            "value": 200000,
            "dayCount": 1
          },
          {
            "label": "Sep 03",
            "startDate": "2025-09-03",
            "endDate": "2025-09-03",
            "value": 350000,
            "dayCount": 1
          },
          {
            "label": "Sep 04",
            "startDate": "2025-09-04",
            "endDate": "2025-09-04",
            "value": 180000,
            "dayCount": 1
          },
          {
            "label": "Sep 05",
            "startDate": "2025-09-05",
            "endDate": "2025-09-05",
            "value": 420000,
            "dayCount": 1
          },
          {
            "label": "Sep 06",
            "startDate": "2025-09-06",
            "endDate": "2025-09-06",
            "value": 120000,
            "dayCount": 1
          },
          {
            "label": "Sep 07",
            "startDate": "2025-09-07",
            "endDate": "2025-09-07",
            "value": 150000,
            "dayCount": 1
          },
          {
            "label": "Sep 08",
            "startDate": "2025-09-08",
            "endDate": "2025-09-08",
            "value": 80000,
            "dayCount": 1
          }
        ]
      }
    },
    "queryPerformanceMs": 156,
    "generatedAt": 1725789000000
  }
}
```

### **Response Examples by Period Type:**

#### **30 Days Response:**
```json
{
  "data": {
    "periodType": "30_days",
    "periodLabel": "Last 30 Days", 
    "metrics": {
      "userGrowth": {
        "total": 87,
        "columns": [
          // 30 daily columns with labels like "Aug 10", "Aug 11", etc.
        ]
      }
    }
  }
}
```

#### **4 Quarters Response:**
```json
{
  "data": {
    "periodType": "4_quarters",
    "periodLabel": "Last 4 Quarters",
    "metrics": {
      "userGrowth": {
        "total": 450,
        "columns": [
          {
            "label": "Q1 2025",
            "startDate": "2025-01-01",
            "endDate": "2025-03-31", 
            "value": 120,
            "dayCount": 90
          },
          {
            "label": "Q2 2025",
            "startDate": "2025-04-01",
            "endDate": "2025-06-30",
            "value": 135,
            "dayCount": 91
          },
          {
            "label": "Q3 2025",
            "startDate": "2025-07-01",
            "endDate": "2025-09-08",
            "value": 95,
            "dayCount": 70
          },
          {
            "label": "Q4 2024",
            "startDate": "2024-10-01",
            "endDate": "2024-12-31",
            "value": 100,
            "dayCount": 92
          }
        ]
      }
    }
  }
}
```

#### **12 Months Response:**
```json
{
  "data": {
    "periodType": "12_months",
    "periodLabel": "Last 12 Months",
    "metrics": {
      "userGrowth": {
        "total": 340,
        "columns": [
          {
            "label": "Oct 2024",
            "startDate": "2024-10-01",
            "endDate": "2024-10-31",
            "value": 25,
            "dayCount": 31
          },
          {
            "label": "Nov 2024", 
            "startDate": "2024-11-01",
            "endDate": "2024-11-30",
            "value": 30,
            "dayCount": 30
          },
          // ... continues for 12 months total
          {
            "label": "Sep 2025",
            "startDate": "2025-09-01",
            "endDate": "2025-09-08",
            "value": 23,
            "dayCount": 8
          }
        ]
      }
    }
  }
}
```

---

## 🔧 **Individual Metric Endpoints (Alternative)**

If you prefer to fetch metrics individually instead of using the unified endpoint:

### **User Growth**
```
GET /api/admin/analytics/user-growth/periods?periodType={periodType}
```

### **Transaction Growth**  
```
GET /api/admin/analytics/transaction-growth/periods?periodType={periodType}
```

### **Revenue Growth**
```
GET /api/admin/analytics/revenue-growth/periods?periodType={periodType}
```

**Individual Response Format:**
```json
{
  "message": "User growth period data retrieved successfully",
  "periodType": "7_days", 
  "data": {
    "periodType": "7_days",
    "periodLabel": "Last 7 Days",
    "total": 23,
    "startDate": "2025-09-02",
    "endDate": "2025-09-08",
    "columnCount": 7,
    "columns": [
      // Same column format as unified response
    ],
    "generatedAt": "2025-09-08T10:30:00Z",
    "queryPerformanceMs": 245
  }
}
```

---

## ⚠️ **Error Responses**

### **Invalid Period Type**
```json
{
  "error": "Invalid period type. Must be one of: 7_days, 30_days, 4_quarters, 12_months",
  "provided": "invalid_period"
}
```
**HTTP Status:** `400 Bad Request`

### **Invalid Date Format**
```json
{
  "error": "Invalid date format. Use YYYY-MM-DD format",
  "details": "Text '2025-13-45' could not be parsed"
}
```
**HTTP Status:** `400 Bad Request`

### **Server Error**
```json
{
  "error": "Failed to retrieve dashboard metrics",
  "details": "Database connection timeout"
}
```
**HTTP Status:** `500 Internal Server Error`

---

## 🔍 **Health Check Endpoint**

**Endpoint:** `GET /api/admin/analytics/health`

**Response:**
```json
{
  "status": "healthy",
  "services": {
    "userGrowthService": "available",
    "transactionGrowthService": "available",
    "revenueGrowthService": "available"
  },
  "supportedPeriods": ["7_days", "30_days", "4_quarters", "12_months"],
  "endpoints": {
    "dashboard": "/api/admin/analytics/dashboard?periodType={periodType}",
    "metric": "/api/admin/analytics/metric/{metricType}?periodType={periodType}",
    "userGrowth": "/api/admin/analytics/user-growth/periods?periodType={periodType}",
    "transactionGrowth": "/api/admin/analytics/transaction-growth/periods?periodType={periodType}",
    "revenueGrowth": "/api/admin/analytics/revenue-growth/periods?periodType={periodType}"
  }
}
```

---

## 📊 **Data Field Definitions**

### **Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `periodType` | string | The requested period type |
| `periodLabel` | string | Human-readable period description |
| `startDate` | string | Start date of the period (ISO format) |
| `endDate` | string | End date of the period (ISO format) |
| `total` | number | Sum of all values in the period |
| `columns` | array | Array of period data points |
| `queryPerformanceMs` | number | API response time in milliseconds |
| `generatedAt` | number | Unix timestamp when data was generated |

### **Column Object Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `label` | string | Display label for the column |
| `startDate` | string | Start date of this data point |
| `endDate` | string | End date of this data point |
| `value` | number | Metric value for this period |
| `dayCount` | number | Number of days included in this data point |

### **Metric Value Meanings:**

- **userGrowth.value**: Number of new user registrations
- **transactionGrowth.value**: Number of completed transactions/trips
- **revenueGrowth.value**: Total revenue in VND (Vietnamese Dong)

---

## 🚀 **Performance Notes**

- **Response Time:** Typically 150-300ms for unified dashboard call
- **Caching:** Data is cached for 2 minutes to improve performance
- **Parallel Processing:** Unified endpoint uses parallel processing for all metrics
- **Complete Days Only:** All calculations exclude the current day (uses only complete days)
- **Timezone:** All dates use Asia/Ho_Chi_Minh timezone

---

## 💡 **Best Practices**

1. **Use Unified Endpoint:** Always prefer `/dashboard` over individual metric endpoints
2. **Cache Frontend Data:** Cache API responses to avoid repeated calls when switching UI views
3. **Handle Loading States:** API calls may take 150-300ms, show loading indicators
4. **Error Handling:** Implement retry logic for