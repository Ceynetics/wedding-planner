import { useState, useCallback, useEffect } from 'react';
import { vendorApi, hiredVendorApi } from '@/api/endpoints';
import { useWorkspace } from '@/context/WorkspaceContext';
import { extractErrorMessage } from '@/utils/errors';
import type { VendorResponse, HiredVendorResponse, HiredVendorRequest } from '@/types/api';

export function useVendors() {
  const { workspace } = useWorkspace();
  const [discoverVendors, setDiscoverVendors] = useState<VendorResponse[]>([]);
  const [hiredVendors, setHiredVendors] = useState<HiredVendorResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDiscoverVendors = useCallback(async (params?: { category?: string; search?: string; page?: number }) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await vendorApi.list(params);
      setDiscoverVendors(data.content);
    } catch (err) { setError(extractErrorMessage(err)); }
    finally { setIsLoading(false); }
  }, []);

  const fetchHiredVendors = useCallback(async () => {
    if (!workspace) return;
    try {
      const { data } = await hiredVendorApi.list(workspace.id);
      setHiredVendors(data);
    } catch (err) { setError(extractErrorMessage(err)); }
  }, [workspace]);

  const createHiredVendor = useCallback(async (data: HiredVendorRequest) => {
    if (!workspace) return;
    const { data: created } = await hiredVendorApi.create(workspace.id, data);
    setHiredVendors((prev) => [...prev, created]);
    return created;
  }, [workspace]);

  const updateHiredVendor = useCallback(async (id: number, data: HiredVendorRequest) => {
    if (!workspace) return;
    const { data: updated } = await hiredVendorApi.update(workspace.id, id, data);
    setHiredVendors((prev) => prev.map((v) => v.id === id ? updated : v));
    return updated;
  }, [workspace]);

  const deleteHiredVendor = useCallback(async (id: number) => {
    if (!workspace) return;
    await hiredVendorApi.delete(workspace.id, id);
    setHiredVendors((prev) => prev.filter((v) => v.id !== id));
  }, [workspace]);

  useEffect(() => { fetchDiscoverVendors(); fetchHiredVendors(); }, [fetchDiscoverVendors, fetchHiredVendors]);

  return {
    discoverVendors, hiredVendors, isLoading, error,
    fetchDiscoverVendors, fetchHiredVendors,
    createHiredVendor, updateHiredVendor, deleteHiredVendor,
  };
}
