import { useState, useCallback, useEffect } from 'react';
import { guestApi } from '@/api/endpoints';
import { useWorkspace } from '@/context/WorkspaceContext';
import { extractErrorMessage } from '@/utils/errors';
import type { GuestResponse, GuestRequest, GuestStatsResponse } from '@/types/api';

export function useGuests() {
  const { workspace } = useWorkspace();
  const [guests, setGuests] = useState<GuestResponse[]>([]);
  const [stats, setStats] = useState<GuestStatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGuests = useCallback(async (params?: { status?: string; side?: string; category?: string; search?: string }) => {
    if (!workspace) return;
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await guestApi.list(workspace.id, params);
      setGuests(data);
    } catch (err) { setError(extractErrorMessage(err)); }
    finally { setIsLoading(false); }
  }, [workspace]);

  const fetchStats = useCallback(async () => {
    if (!workspace) return;
    try {
      const { data } = await guestApi.stats(workspace.id);
      setStats(data);
    } catch { /* silent */ }
  }, [workspace]);

  const createGuest = useCallback(async (data: GuestRequest) => {
    if (!workspace) return;
    const { data: created } = await guestApi.create(workspace.id, data);
    setGuests((prev) => [...prev, created]);
    fetchStats();
    return created;
  }, [workspace, fetchStats]);

  const updateGuest = useCallback(async (id: number, data: GuestRequest) => {
    if (!workspace) return;
    const { data: updated } = await guestApi.update(workspace.id, id, data);
    setGuests((prev) => prev.map((g) => g.id === id ? updated : g));
    fetchStats();
    return updated;
  }, [workspace, fetchStats]);

  const deleteGuest = useCallback(async (id: number) => {
    if (!workspace) return;
    await guestApi.delete(workspace.id, id);
    setGuests((prev) => prev.filter((g) => g.id !== id));
    fetchStats();
  }, [workspace, fetchStats]);

  useEffect(() => { fetchGuests(); fetchStats(); }, [fetchGuests, fetchStats]);

  return { guests, stats, isLoading, error, fetchGuests, fetchStats, createGuest, updateGuest, deleteGuest };
}
