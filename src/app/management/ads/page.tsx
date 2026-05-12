"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fetchAdvertisements, publishAdvertisement, unpublishAdvertisement, uploadAdvertisementBanner, createAdvertisement, updateAdvertisement, deleteAdvertisement, type Advertisement } from "@/services/advertisements.services";
import { useToast } from "@/contexts/ToastContext";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

const STATUS_OPTIONS = [
  "ALL",
  "DRAFT",
  "PENDING",
  "PUBLISHED",
  "EXPIRED",
  "ARCHIVED",
  "DISABLED",
] as const;

import { ProtectedRoute } from "@/components/Auth/ProtectedRoute";

export default function AdvertisementsPage() {
  const { accessToken } = useAuth();
  const toast = useToast();
  const [status, setStatus] = useState<(typeof STATUS_OPTIONS)[number]>("ALL");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalCount: 0, limit: 10 });
  const [summary, setSummary] = useState<{ statusCounts: Record<string, number>; todayClicks: number; totalActive: number } | null>(null);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Loading advertisements with status:', status);
      
      try {
        const res = await fetchAdvertisements({ 
          status, 
          page, 
          limit, 
          sortBy: "createdAt", 
          sortOrder: "DESC" 
        }, accessToken || undefined);
        
        if (!isMounted) return;
        
        console.log('✅ Advertisements loaded:', res);
        
        setAds(res.advertisements);
        setPagination(res.pagination);
        setSummary(res.summary ?? null);
        setError(null);
        
        // Enhanced logging for debugging
        console.log(`📊 Status: ${status} -> ${res.advertisements.length} ads found`);
        console.log('📋 Summary:', res.summary);
        
      } catch (err: any) {
        if (!isMounted) return;
        console.error('❌ Failed to load advertisements:', err);
        setError(err?.message || "Failed to load advertisements");
        setAds([]);
        setPagination({ currentPage: 1, totalPages: 1, totalCount: 0, limit: 10 });
        setSummary(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, [status, page, limit, accessToken]);

  useEffect(() => {
    setPage(1);
  }, [status]);

  const formatClicks = useMemo(() => (n: number) => new Intl.NumberFormat().format(n), []);

  // Enhanced status change handler with logging
  const handleStatusChange = (newStatus: typeof STATUS_OPTIONS[number]) => {
    console.log('🔄 Status filter changed from', status, 'to', newStatus);
    setStatus(newStatus);
  };

  return (
    <ProtectedRoute requireAuth={true}>
    <div className="space-y-5">
      <Breadcrumb pageName="Advertisements" />

      {/* Summary */}
      {summary && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-1 max-w-xs">
          <div className="rounded-lg border p-4 dark:border-dark-3">
            <div className="text-sm text-neutral-500">Active Ads</div>
            <div className="text-2xl font-bold">{summary.totalActive}</div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between gap-3">
        <select
          value={status}
          onChange={(e) => handleStatusChange(e.target.value as any)}
          className="w-full max-w-xs rounded-md border px-3 py-2 dark:border-dark-3 dark:bg-dark-2"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt} {summary?.statusCounts?.[opt] || summary?.statusCounts?.[opt.toLowerCase()] ? 
                `(${summary.statusCounts[opt] || summary.statusCounts[opt.toLowerCase()]})` : ''}
            </option>
          ))}
        </select>

        <NewAdButton onCreated={async () => {
          console.log('🔄 Refreshing advertisements after creation');
          const res = await fetchAdvertisements({ status, page, limit, sortBy: "createdAt", sortOrder: "DESC" }, accessToken || undefined);
          setAds(res.advertisements);
          setPagination(res.pagination);
          setSummary(res.summary ?? null);
          toast.show({ type: 'success', message: 'Advertisements updated' });
        }} accessToken={accessToken || undefined} />
      </div>

      {/* Table */}
      <div className="rounded-[10px] bg-white p-0 shadow-1 dark:bg-gray-dark">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Banner</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Publish Type</TableHead>
              <TableHead>Start</TableHead>
              <TableHead>End</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Clicks</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    Loading advertisements...
                  </div>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={10} className="text-red text-center py-8">
                  <div>
                    <div className="font-semibold">Error loading advertisements</div>
                    <div className="text-sm mt-1">{error}</div>
                    <button 
                      onClick={() => window.location.reload()} 
                      className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                    >
                      Refresh Page
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ) : ads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8">
                  <div>
                    <div className="text-lg font-semibold text-neutral-600">No advertisements found</div>
                    <div className="text-sm text-neutral-500 mt-1">
                      {status === 'ALL' ? 
                        'No advertisements have been created yet.' : 
                        `No advertisements with status "${status}" found.`
                      }
                    </div>
                    {status !== 'ALL' && (
                      <button 
                        onClick={() => setStatus('ALL')} 
                        className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
                      >
                        Show All Advertisements
                      </button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              ads.map((ad) => (
                <TableRow key={ad.adId}>
                  <TableCell>
                    {ad.bannerUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={ad.bannerUrl} alt={ad.name} className="h-12 w-24 rounded object-cover" />
                    ) : (
                      <div className="h-12 w-24 rounded bg-neutral-100 flex items-center justify-center text-xs text-neutral-500">
                        No Image
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{ad.name}</TableCell>
                  <TableCell>
                    <a href={ad.destinationLink} target="_blank" rel="noreferrer" className="text-primary underline hover:text-primary/80 text-sm">
                      {ad.destinationLink.length > 40 ? 
                        `${ad.destinationLink.substring(0, 40)}...` : 
                        ad.destinationLink
                      }
                    </a>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${
                      ad.publishType === 'IMMEDIATE' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {ad.publishType}
                    </span>
                  </TableCell>
                  <TableCell>{ad.startDate?.replace('T', ' ').slice(0, 16) || '-'}</TableCell>
                  <TableCell>{ad.endDate?.replace('T', ' ').slice(0, 16) || '-'}</TableCell>
                  <TableCell><StatusBadge status={ad.status} /></TableCell>
                  <TableCell>{formatClicks(ad.analytics?.totalClicks ?? 0)}</TableCell>
                  <TableCell>{ad.createdAt?.replace('T', ' ').slice(0, 16)}</TableCell>
                  <TableCell>
                    <RowActions
                      ad={ad}
                      onChanged={async () => {
                        console.log('🔄 Refreshing advertisements after action');
                        const res = await fetchAdvertisements({ status, page, limit, sortBy: "createdAt", sortOrder: "DESC" }, accessToken || undefined);
                        setAds(res.advertisements);
                        setPagination(res.pagination);
                        setSummary(res.summary ?? null);
                      }}
                      accessToken={accessToken || undefined}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Enhanced Pagination */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-neutral-600">
          Showing {ads.length} of {pagination.totalCount} advertisements
          {status !== 'ALL' && ` (filtered by ${status})`}
        </div>
        <div className="flex items-center gap-1">
          {/* Previous Button */}
          <button
            disabled={page <= 1}
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
            disabled={pagination.currentPage >= pagination.totalPages}
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
    DRAFT: "bg-gray-100 text-gray-800",
    PENDING: "bg-yellow-100 text-yellow-800",
    PUBLISHED: "bg-green-100 text-green-800",
    EXPIRED: "bg-orange-100 text-orange-800",
    ARCHIVED: "bg-neutral-200 text-neutral-700",
    DISABLED: "bg-red-100 text-red-800",
  };
  const cls = colors[status] || "bg-gray-100 text-gray-800";
  return <span className={`rounded-full px-2 py-1 text-xs font-medium ${cls}`}>{status}</span>;
}

function RowActions({ ad, onChanged, accessToken }: { ad: Advertisement; onChanged: () => Promise<void> | void; accessToken?: string }) {
  const [busy, setBusy] = useState(false);
  const [confirmState, setConfirmState] = useState<null | { type: 'publish' | 'unpublish' | 'delete'; title: string; message: string }>(null);
  const toast = useToast();

  const handlePublish = async () => {
    try {
      setBusy(true);
      console.log('📤 Publishing advertisement:', ad.adId);
      await publishAdvertisement(ad.adId, accessToken);
      toast.show({ type: 'success', message: 'Advertisement published successfully' });
      await onChanged();
    } catch (e: any) {
      console.error('❌ Publish failed:', e);
      toast.show({ type: 'error', message: e?.message || 'Failed to publish advertisement' });
    } finally {
      setBusy(false);
    }
  };

  const handleUnpublish = async () => {
    try {
      setBusy(true);
      console.log('📤 Unpublishing advertisement:', ad.adId);
      await unpublishAdvertisement(ad.adId, accessToken);
      toast.show({ type: 'success', message: 'Advertisement unpublished successfully' });
      await onChanged();
    } catch (e: any) {
      console.error('❌ Unpublish failed:', e);
      toast.show({ type: 'error', message: e?.message || 'Failed to unpublish advertisement' });
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    try {
      setBusy(true);
      console.log('📤 Deleting advertisement:', ad.adId);
      await deleteAdvertisement(ad.adId, accessToken);
      toast.show({ type: 'success', message: 'Advertisement deleted successfully' });
      await onChanged();
    } catch (e: any) {
      console.error('❌ Delete failed:', e);
      toast.show({ type: 'error', message: e?.message || 'Failed to delete advertisement' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <EditAdButton ad={ad} accessToken={accessToken} onSaved={onChanged} />
      
      {(ad.status === 'DRAFT' || ad.status === 'PENDING') && (
        <button
          onClick={() => setConfirmState({ 
            type: 'publish', 
            title: 'Publish advertisement', 
            message: `Are you sure you want to publish "${ad.name}"? It will be visible to mobile app users.` 
          })}
          disabled={busy}
          className="rounded-md border border-green-600 px-2 py-1 text-xs text-green-700 hover:bg-green-50 disabled:opacity-50 transition-colors"
        >
          {busy ? 'Publishing...' : 'Publish'}
        </button>
      )}
      
      {ad.status === 'PUBLISHED' && (
        <button
          onClick={() => setConfirmState({ 
            type: 'unpublish', 
            title: 'Unpublish advertisement', 
            message: `Are you sure you want to unpublish "${ad.name}"? It will no longer be visible to mobile app users.` 
          })}
          disabled={busy}
          className="rounded-md border border-yellow-600 px-2 py-1 text-xs text-yellow-700 hover:bg-yellow-50 disabled:opacity-50 transition-colors"
        >
          {busy ? 'Unpublishing...' : 'Unpublish'}
        </button>
      )}
      
      <button
        onClick={() => setConfirmState({ 
          type: 'delete', 
          title: 'Delete advertisement', 
          message: `Are you sure you want to delete "${ad.name}"? This action cannot be undone.` 
        })}
        disabled={busy}
        className="rounded-md border border-red-600 px-2 py-1 text-xs text-red-700 hover:bg-red-50 disabled:opacity-50 transition-colors"
      >
        {busy ? 'Deleting...' : 'Delete'}
      </button>
      
      <ConfirmDialog
        open={!!confirmState}
        title={confirmState?.title || ''}
        message={confirmState?.message || ''}
        confirmText={confirmState?.type === 'delete' ? 'Delete' : confirmState?.type === 'publish' ? 'Publish' : 'Unpublish'}
        onCancel={() => setConfirmState(null)}
        onConfirm={async () => {
          const type = confirmState?.type;
          setConfirmState(null);
          if (type === 'delete') {
            await handleDelete();
          } else if (type === 'publish') {
            await handlePublish();
          } else if (type === 'unpublish') {
            await handleUnpublish();
          }
        }}
      />
    </div>
  );
}

function NewAdButton({ onCreated, accessToken }: { onCreated: () => Promise<void> | void; accessToken?: string }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState("");
  const [destinationLink, setDestinationLink] = useState("");
  const [description, setDescription] = useState("");
  type LocalPublishType = 'IMMEDIATE' | 'SCHEDULED' | 'MANUAL';
  const [publishType, setPublishType] = useState<LocalPublishType>('IMMEDIATE');
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const reset = () => {
    setName("");
    setDestinationLink("");
    setDescription("");
    setPublishType('IMMEDIATE');
    setStartDate("");
    setEndDate("");
    setBannerFile(null);
    setBannerPreview(null);
  };

  const toast = useToast();
  const handleSubmit = async () => {
    try {
      setBusy(true);
      console.log('📤 Creating new advertisement:', name);
      
      // Client-side validations
      if (!name.trim()) {
        toast.show({ type: 'error', message: 'Name is required' });
        return;
      }
      try {
        new URL(destinationLink);
      } catch {
        toast.show({ type: 'error', message: 'Destination Link must be a valid URL (include http/https)' });
        return;
      }
      if (publishType === 'SCHEDULED') {
        if (!startDate || !endDate) {
          toast.show({ type: 'error', message: 'Start and End date are required for SCHEDULED' });
          return;
        }
        if (new Date(endDate) <= new Date(startDate)) {
          toast.show({ type: 'error', message: 'End date must be after Start date' });
          return;
        }
      }
      if (bannerFile) {
        const maxBytes = 5 * 1024 * 1024;
        const okType = /image\/(jpeg|jpg|png|webp)/i.test(bannerFile.type);
        if (!okType) {
          toast.show({ type: 'error', message: 'Banner must be JPEG, PNG, or WebP' });
          return;
        }
        if (bannerFile.size > maxBytes) {
          toast.show({ type: 'error', message: 'Banner must be ≤ 5MB' });
          return;
        }
      }
      
      let bannerFileName: string | undefined;
      if (bannerFile) {
        console.log('📤 Uploading banner...');
        const res = await uploadAdvertisementBanner(bannerFile, accessToken);
        bannerFileName = res.fileName;
        console.log('✅ Banner uploaded:', bannerFileName);
      }
      
      // Map MANUAL to SCHEDULED with far-future start and end dates to satisfy backend validation
      const payloadPublishType = publishType === 'MANUAL' ? 'SCHEDULED' : publishType;
      const farFutureStart = '2099-01-01T00:00:00';
      const farFutureEnd = '2099-12-31T23:59:59';
      
      await createAdvertisement({
        name,
        destinationLink,
        description: description || undefined,
        publishType: payloadPublishType,
        startDate:
          publishType === 'SCHEDULED'
            ? startDate || undefined
            : publishType === 'MANUAL'
              ? farFutureStart
              : undefined,
        endDate:
          publishType === 'SCHEDULED'
            ? endDate || undefined
            : publishType === 'MANUAL'
              ? farFutureEnd
              : undefined,
        bannerFileName,
      }, accessToken);
      
      toast.show({ type: 'success', message: 'Advertisement created successfully' });
      await onCreated();
      reset();
      setOpen(false);
    } catch (e: any) {
      console.error('❌ Create advertisement failed:', e);
      toast.show({ type: 'error', message: e?.message || 'Failed to create advertisement' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-md bg-primary px-4 py-2 text-white font-medium hover:bg-primary/90 transition-colors"
      >
        New Advertisement
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl dark:bg-gray-dark max-h-[90vh] overflow-y-auto">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Create Advertisement</h2>
              <button 
                onClick={() => { setOpen(false); reset(); }} 
                className="text-neutral-500 hover:text-neutral-700 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <label className="block">
                <span className="mb-1 block text-sm font-medium">Name <span className="text-red-500">*</span></span>
                <input 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="w-full rounded-md border px-3 py-2 dark:border-dark-3 dark:bg-dark-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" 
                  placeholder="Enter advertisement name"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium">Destination Link <span className="text-red-500">*</span></span>
                <input 
                  value={destinationLink} 
                  onChange={(e) => setDestinationLink(e.target.value)} 
                  className="w-full rounded-md border px-3 py-2 dark:border-dark-3 dark:bg-dark-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" 
                  placeholder="https://example.com"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium">Description (optional)</span>
                <textarea 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  className="w-full rounded-md border px-3 py-2 dark:border-dark-3 dark:bg-dark-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" 
                  rows={3}
                  placeholder="Enter advertisement description"
                />
              </label>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <label className="block">
                  <span className="mb-1 block text-sm font-medium">Publish Type</span>
                  <select 
                    value={publishType} 
                    onChange={(e) => setPublishType(e.target.value as LocalPublishType)} 
                    className="w-full rounded-md border px-3 py-2 dark:border-dark-3 dark:bg-dark-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="IMMEDIATE">IMMEDIATE (publish now)</option>
                    <option value="SCHEDULED">SCHEDULED (set dates)</option>
                    <option value="MANUAL">MANUAL (publish later)</option>
                  </select>
                </label>

                {publishType === 'SCHEDULED' && (
                  <>
                    <label className="block">
                      <span className="mb-1 block text-sm font-medium">Start Date <span className="text-red-500">*</span></span>
                      <input 
                        type="datetime-local" 
                        value={startDate} 
                        onChange={(e) => setStartDate(e.target.value)} 
                        className="w-full rounded-md border px-3 py-2 dark:border-dark-3 dark:bg-dark-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" 
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-sm font-medium">End Date <span className="text-red-500">*</span></span>
                      <input 
                        type="datetime-local" 
                        value={endDate} 
                        onChange={(e) => setEndDate(e.target.value)} 
                        className="w-full rounded-md border px-3 py-2 dark:border-dark-3 dark:bg-dark-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" 
                      />
                    </label>
                  </>
                )}
              </div>

              <div>
                <span className="mb-1 block text-sm font-medium">Banner Image (JPEG/PNG/WebP, ≤ 5MB)</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => {
                    const f = e.target.files?.[0] || null;
                    setBannerFile(f);
                    setBannerPreview(f ? URL.createObjectURL(f) : null);
                  }}
                  className="w-full rounded-md border px-3 py-2 dark:border-dark-3 dark:bg-dark-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {bannerPreview && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={bannerPreview} alt="preview" className="mt-3 h-24 w-48 rounded object-cover border" />
                )}
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button 
                  onClick={() => { setOpen(false); reset(); }} 
                  className="rounded-md border px-4 py-2 font-medium hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSubmit} 
                  disabled={busy || !name || !destinationLink} 
                  className="rounded-md bg-primary px-4 py-2 text-white font-medium disabled:opacity-50 hover:bg-primary/90 transition-colors"
                >
                  {busy ? 'Creating…' : 'Create Advertisement'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function EditAdButton({ ad, onSaved, accessToken }: { ad: Advertisement; onSaved: () => Promise<void> | void; accessToken?: string }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState(ad.name);
  const [destinationLink, setDestinationLink] = useState(ad.destinationLink);
  const [description, setDescription] = useState(ad.description || "");
  const [publishType, setPublishType] = useState<'IMMEDIATE' | 'SCHEDULED'>(ad.publishType);
  const [startDate, setStartDate] = useState(ad.startDate ? ad.startDate.slice(0,16) : "");
  const [endDate, setEndDate] = useState(ad.endDate ? ad.endDate.slice(0,16) : "");

  const toast = useToast();
  const handleSave = async () => {
    try {
      setBusy(true);
      console.log('📤 Updating advertisement:', ad.adId);
      
      if (!name.trim()) {
        toast.show({ type: 'error', message: 'Name is required' });
        return;
      }
      try {
        new URL(destinationLink);
      } catch {
        toast.show({ type: 'error', message: 'Destination Link must be a valid URL (include http/https)' });
        return;
      }
      if (publishType === 'SCHEDULED') {
        if (!startDate || !endDate) {
          toast.show({ type: 'error', message: 'Start and End date are required for SCHEDULED' });
          return;
        }
        if (new Date(endDate) <= new Date(startDate)) {
          toast.show({ type: 'error', message: 'End date must be after Start date' });
          return;
        }
      }
      
      await updateAdvertisement(ad.adId, {
        name,
        destinationLink,
        description: description || undefined,
        publishType,
        startDate: publishType === 'SCHEDULED' ? startDate || undefined : undefined,
        endDate: publishType === 'SCHEDULED' ? endDate || undefined : undefined,
      }, accessToken);
      
      toast.show({ type: 'success', message: 'Advertisement updated successfully' });
      await onSaved();
      setOpen(false);
    } catch (e: any) {
      console.error('❌ Update advertisement failed:', e);
      toast.show({ type: 'error', message: e?.message || 'Failed to update advertisement' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-md border px-2 py-1 text-xs hover:bg-neutral-50 transition-colors"
      >
        Edit
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl dark:bg-gray-dark max-h-[90vh] overflow-y-auto">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Edit Advertisement</h2>
              <button onClick={() => setOpen(false)} className="text-neutral-500 hover:text-neutral-700 transition-colors">✕</button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <label className="block">
                <span className="mb-1 block text-sm font-medium">Name <span className="text-red-500">*</span></span>
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-md border px-3 py-2 dark:border-dark-3 dark:bg-dark-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium">Destination Link <span className="text-red-500">*</span></span>
                <input value={destinationLink} onChange={(e) => setDestinationLink(e.target.value)} className="w-full rounded-md border px-3 py-2 dark:border-dark-3 dark:bg-dark-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium">Description (optional)</span>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-md border px-3 py-2 dark:border-dark-3 dark:bg-dark-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" rows={3} />
              </label>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <label className="block">
                  <span className="mb-1 block text-sm font-medium">Publish Type</span>
                  <select value={publishType} onChange={(e) => setPublishType(e.target.value as any)} className="w-full rounded-md border px-3 py-2 dark:border-dark-3 dark:bg-dark-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
                    <option value="IMMEDIATE">IMMEDIATE</option>
                    <option value="SCHEDULED">SCHEDULED</option>
                  </select>
                </label>
                {publishType === 'SCHEDULED' && (
                  <>
                    <label className="block">
                      <span className="mb-1 block text-sm font-medium">Start Date <span className="text-red-500">*</span></span>
                      <input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full rounded-md border px-3 py-2 dark:border-dark-3 dark:bg-dark-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-sm font-medium">End Date <span className="text-red-500">*</span></span>
                      <input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full rounded-md border px-3 py-2 dark:border-dark-3 dark:bg-dark-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
                    </label>
                  </>
                )}
              </div>
              <div className="mt-6 flex items-center justify-end gap-3">
                <button onClick={() => setOpen(false)} className="rounded-md border px-4 py-2 font-medium hover:bg-neutral-50 transition-colors">Cancel</button>
                <button onClick={handleSave} disabled={busy || !name || !destinationLink} className="rounded-md bg-primary px-4 py-2 text-white font-medium disabled:opacity-50 hover:bg-primary/90 transition-colors">
                  {busy ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
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