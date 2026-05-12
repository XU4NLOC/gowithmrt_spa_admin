"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/Auth/ProtectedRoute";
import {
  fetchTransactions,
  type TransactionItem,
  type TransactionListResponse,
} from "@/services/transactions.services";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

const STATUS_OPTIONS = [
  "ALL",
  "Pending",
  "Confirmed",
  "Completed",
  "Declined",
  "Cancelled",
  "Expired",
] as const;

export default function TransactionsPage() {
  const { accessToken } = useAuth();
  const [senderName, setSenderName] = useState("");
  const [status, setStatus] = useState<(typeof STATUS_OPTIONS)[number]>("ALL");
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TransactionItem[]>([]);
  const [pagination, setPagination] = useState<TransactionListResponse["pagination"]>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
  limit: 10,
    hasNext: false,
    hasPrevious: false,
  });

  const debouncedSenderName = useDebounce(senderName, 300);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchTransactions(
          { senderName: debouncedSenderName, status, page, limit },
          accessToken || undefined,
        );
        if (!isMounted) return;
        setData(res.data);
        setPagination(res.pagination);
        setError(null);
      } catch (err: any) {
        if (!isMounted) return;
        setError(err?.message || "Failed to load transactions");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, [debouncedSenderName, status, page, limit, accessToken]);

  useEffect(() => {
    // Reset to first page when filters change (except page itself)
    setPage(1);
  }, [debouncedSenderName, status]);

  const formatCurrency = useMemo(
    () =>
      (amount: number) =>
        new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount),
    [],
  );

  return (
    <ProtectedRoute requireAuth={true}>
    <div className="space-y-5">
      <Breadcrumb pageName="Transactions" />

      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="text"
          placeholder="Search by sender name..."
          value={senderName}
          onChange={(e) => setSenderName(e.target.value)}
          className="w-full max-w-sm rounded-md border px-3 py-2 dark:border-dark-3 dark:bg-dark-2"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
          className="w-full max-w-xs rounded-md border px-3 py-2 dark:border-dark-3 dark:bg-dark-2"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-[10px] bg-white p-0 shadow-1 dark:bg-gray-dark">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Index</TableHead>
              <TableHead>Sender</TableHead>
              <TableHead>Receiver</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>End Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total Cost</TableHead>
              <TableHead>Sender Cost</TableHead>
              <TableHead>Receiver Cost</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9}>Loading...</TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={9} className="text-red">
                  {error}
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9}>No transactions found</TableCell>
              </TableRow>
            ) : (
              data.map((t) => (
                <TableRow key={t.transactionId}>
                  <TableCell>{t.index}</TableCell>
                  <TableCell>{t.sender}</TableCell>
                  <TableCell>{t.receiver}</TableCell>
                  <TableCell>{t.startTimeFormatted ?? "-"}</TableCell>
                  <TableCell>{t.endTimeFormatted ?? "-"}</TableCell>
                  <TableCell>
                    <StatusBadge status={t.status} />
                  </TableCell>
                  <TableCell>
                    {t.costCalculated ? formatCurrency(t.totalCost) : "Not calculated"}
                  </TableCell>
                  <TableCell>
                    {t.costCalculated ? formatCurrency(t.senderCost) : "-"}
                  </TableCell>
                  <TableCell>
                    {t.costCalculated ? formatCurrency(t.receiverCost) : "-"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-neutral-600">
          Showing {data.length} of {pagination.totalCount} transactions
        </div>
        <div className="flex items-center gap-1">
          {/* Previous Button */}
          <button
            disabled={!pagination.hasPrevious}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-md border px-3 py-1 text-sm disabled:opacity-50 hover:bg-neutral-50 disabled:hover:bg-transparent transition-colors"
          >
            Previous
          </button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1 mx-2">
            {renderPageNumbers(pagination.currentPage, pagination.totalPages, setPage)}
          </div>

          {/* Next Button */}
          <button
            disabled={!pagination.hasNext}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-md border px-3 py-1 text-sm disabled:opacity-50 hover:bg-neutral-50 disabled:hover:bg-transparent transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Pending: "bg-yellow-100 text-yellow-800",
    Confirmed: "bg-blue-100 text-blue-800",
    Completed: "bg-green-100 text-green-800",
    Declined: "bg-red-100 text-red-800",
    Cancelled: "bg-gray-100 text-gray-800",
    Expired: "bg-orange-100 text-orange-800",
  };
  const cls = colors[status] || "bg-gray-100 text-gray-800";
  return <span className={`rounded-full px-2 py-1 text-xs ${cls}`}>{status}</span>;
}

function useDebounce<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

function renderPageNumbers(currentPage: number, totalPages: number, setPage: (page: number) => void) {
  const pages = [];
  const maxVisiblePages = 7; // Show up to 7 page numbers
  
  if (totalPages <= maxVisiblePages) {
    // Show all pages if total is small
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          className={`rounded-md px-3 py-1 text-sm transition-colors ${
            i === currentPage
              ? 'bg-primary text-white'
              : 'border hover:bg-neutral-50'
          }`}
        >
          {i}
        </button>
      );
    }
  } else {
    // Complex pagination with ellipsis
    const leftSiblingIndex = Math.max(currentPage - 1, 1);
    const rightSiblingIndex = Math.min(currentPage + 1, totalPages);
    
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;
    
    const firstPageIndex = 1;
    const lastPageIndex = totalPages;
    
    if (!shouldShowLeftDots && shouldShowRightDots) {
      // No left dots, show right dots
      const leftItemCount = 3;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      
      pages.push(
        ...leftRange.map(pageNumber => (
          <button
            key={pageNumber}
            onClick={() => setPage(pageNumber)}
            className={`rounded-md px-3 py-1 text-sm transition-colors ${
              pageNumber === currentPage
                ? 'bg-primary text-white'
                : 'border hover:bg-neutral-50'
            }`}
          >
            {pageNumber}
          </button>
        ))
      );
      
      pages.push(<span key="dots-right" className="px-2 text-neutral-500">...</span>);
      pages.push(
        <button
          key={lastPageIndex}
          onClick={() => setPage(lastPageIndex)}
          className="rounded-md border px-3 py-1 text-sm hover:bg-neutral-50 transition-colors"
        >
          {lastPageIndex}
        </button>
      );
    } else if (shouldShowLeftDots && !shouldShowRightDots) {
      // Show left dots, no right dots
      const rightItemCount = 3;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1
      );
      
      pages.push(
        <button
          key={firstPageIndex}
          onClick={() => setPage(firstPageIndex)}
          className="rounded-md border px-3 py-1 text-sm hover:bg-neutral-50 transition-colors"
        >
          {firstPageIndex}
        </button>
      );
      pages.push(<span key="dots-left" className="px-2 text-neutral-500">...</span>);
      
      pages.push(
        ...rightRange.map(pageNumber => (
          <button
            key={pageNumber}
            onClick={() => setPage(pageNumber)}
            className={`rounded-md px-3 py-1 text-sm transition-colors ${
              pageNumber === currentPage
                ? 'bg-primary text-white'
                : 'border hover:bg-neutral-50'
            }`}
          >
            {pageNumber}
          </button>
        ))
      );
    } else {
      // Show both left and right dots
      pages.push(
        <button
          key={firstPageIndex}
          onClick={() => setPage(firstPageIndex)}
          className="rounded-md border px-3 py-1 text-sm hover:bg-neutral-50 transition-colors"
        >
          {firstPageIndex}
        </button>
      );
      pages.push(<span key="dots-left" className="px-2 text-neutral-500">...</span>);
      
      // Show current page and siblings
      for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => setPage(i)}
            className={`rounded-md px-3 py-1 text-sm transition-colors ${
              i === currentPage
                ? 'bg-primary text-white'
                : 'border hover:bg-neutral-50'
            }`}
          >
            {i}
          </button>
        );
      }
      
      pages.push(<span key="dots-right" className="px-2 text-neutral-500">...</span>);
      pages.push(
        <button
          key={lastPageIndex}
          onClick={() => setPage(lastPageIndex)}
          className="rounded-md border px-3 py-1 text-sm hover:bg-neutral-50 transition-colors"
        >
          {lastPageIndex}
        </button>
      );
    }
  }
  
  return pages;
}


