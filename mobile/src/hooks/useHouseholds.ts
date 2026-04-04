import { useState, useCallback, useEffect } from 'react';
import { householdApi } from '@/api/endpoints';
import { useWorkspace } from '@/context/WorkspaceContext';
import { extractErrorMessage } from '@/utils/errors';
import type { HouseholdResponse, HouseholdRequest } from '@/types/api';

export function useHouseholds() {
  const { workspace } = useWorkspace();
  const [households, setHouseholds] = useState<HouseholdResponse[]>([]);
  const [unassigned, setUnassigned] = useState<HouseholdResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHouseholds = useCallback(async () => {
    if (!workspace) return;
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await householdApi.list(workspace.id);
      setHouseholds(data);
    } catch (err) { setError(extractErrorMessage(err)); }
    finally { setIsLoading(false); }
  }, [workspace]);

  const fetchUnassigned = useCallback(async () => {
    if (!workspace) return;
    try {
      const { data } = await householdApi.unassigned(workspace.id);
      setUnassigned(data);
    } catch { /* silent */ }
  }, [workspace]);

  const createHousehold = useCallback(async (data: HouseholdRequest) => {
    if (!workspace) return;
    const { data: created } = await householdApi.create(workspace.id, data);
    setHouseholds((prev) => [...prev, created]);
    return created;
  }, [workspace]);

  const updateHousehold = useCallback(async (id: number, data: HouseholdRequest) => {
    if (!workspace) return;
    const { data: updated } = await householdApi.update(workspace.id, id, data);
    setHouseholds((prev) => prev.map((h) => h.id === id ? updated : h));
    return updated;
  }, [workspace]);

  const deleteHousehold = useCallback(async (id: number) => {
    if (!workspace) return;
    await householdApi.delete(workspace.id, id);
    setHouseholds((prev) => prev.filter((h) => h.id !== id));
  }, [workspace]);

  useEffect(() => { fetchHouseholds(); }, [fetchHouseholds]);

  return { households, unassigned, isLoading, error, fetchHouseholds, fetchUnassigned, createHousehold, updateHousehold, deleteHousehold };
}
