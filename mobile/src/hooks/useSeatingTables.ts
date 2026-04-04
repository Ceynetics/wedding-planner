import { useState, useCallback, useEffect } from 'react';
import { seatingTableApi } from '@/api/endpoints';
import { useWorkspace } from '@/context/WorkspaceContext';
import { extractErrorMessage } from '@/utils/errors';
import type { SeatingTableResponse, SeatingTableRequest, PositionUpdateRequest, SeatingStatsResponse, HouseholdResponse } from '@/types/api';

export function useSeatingTables() {
  const { workspace } = useWorkspace();
  const [tables, setTables] = useState<SeatingTableResponse[]>([]);
  const [stats, setStats] = useState<SeatingStatsResponse | null>(null);
  const [unassignedHouseholds, setUnassignedHouseholds] = useState<HouseholdResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTables = useCallback(async () => {
    if (!workspace) return;
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await seatingTableApi.list(workspace.id);
      setTables(data);
    } catch (err) { setError(extractErrorMessage(err)); }
    finally { setIsLoading(false); }
  }, [workspace]);

  const fetchStats = useCallback(async () => {
    if (!workspace) return;
    try {
      const { data } = await seatingTableApi.stats(workspace.id);
      setStats(data);
    } catch { /* silent */ }
  }, [workspace]);

  const fetchUnassignedHouseholds = useCallback(async () => {
    if (!workspace) return;
    try {
      const { data } = await seatingTableApi.unassignedHouseholds(workspace.id);
      setUnassignedHouseholds(data);
    } catch { /* silent */ }
  }, [workspace]);

  const createTable = useCallback(async (data: SeatingTableRequest) => {
    if (!workspace) return;
    const { data: created } = await seatingTableApi.create(workspace.id, data);
    setTables((prev) => [...prev, created]);
    fetchStats();
    return created;
  }, [workspace, fetchStats]);

  const updateTable = useCallback(async (id: number, data: SeatingTableRequest) => {
    if (!workspace) return;
    const { data: updated } = await seatingTableApi.update(workspace.id, id, data);
    setTables((prev) => prev.map((t) => t.id === id ? updated : t));
    fetchStats();
    return updated;
  }, [workspace, fetchStats]);

  const deleteTable = useCallback(async (id: number) => {
    if (!workspace) return;
    await seatingTableApi.delete(workspace.id, id);
    setTables((prev) => prev.filter((t) => t.id !== id));
    fetchStats();
  }, [workspace, fetchStats]);

  const updatePosition = useCallback(async (id: number, data: PositionUpdateRequest) => {
    if (!workspace) return;
    const { data: updated } = await seatingTableApi.updatePosition(workspace.id, id, data);
    setTables((prev) => prev.map((t) => t.id === id ? updated : t));
    return updated;
  }, [workspace]);

  const assignHouseholds = useCallback(async (tableId: number, householdIds: number[]) => {
    if (!workspace) return;
    const { data: updated } = await seatingTableApi.assignHouseholds(workspace.id, tableId, householdIds);
    setTables((prev) => prev.map((t) => t.id === tableId ? updated : t));
    fetchStats();
    fetchUnassignedHouseholds();
    return updated;
  }, [workspace, fetchStats, fetchUnassignedHouseholds]);

  const unassignHousehold = useCallback(async (tableId: number, householdId: number) => {
    if (!workspace) return;
    await seatingTableApi.unassignHousehold(workspace.id, tableId, householdId);
    fetchTables();
    fetchStats();
    fetchUnassignedHouseholds();
  }, [workspace, fetchTables, fetchStats, fetchUnassignedHouseholds]);

  useEffect(() => { fetchTables(); fetchStats(); }, [fetchTables, fetchStats]);

  return {
    tables, stats, unassignedHouseholds, isLoading, error,
    fetchTables, fetchStats, fetchUnassignedHouseholds,
    createTable, updateTable, deleteTable, updatePosition,
    assignHouseholds, unassignHousehold,
  };
}
