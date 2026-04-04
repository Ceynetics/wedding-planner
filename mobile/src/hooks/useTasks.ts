import { useState, useCallback, useEffect } from 'react';
import { taskApi } from '@/api/endpoints';
import { useWorkspace } from '@/context/WorkspaceContext';
import { extractErrorMessage } from '@/utils/errors';
import type { TaskResponse, TaskRequest, TaskStatsResponse } from '@/types/api';

export function useTasks() {
  const { workspace } = useWorkspace();
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [stats, setStats] = useState<TaskStatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async (params?: { completed?: boolean; category?: string; priority?: string }) => {
    if (!workspace) return;
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await taskApi.list(workspace.id, params);
      setTasks(data);
    } catch (err) { setError(extractErrorMessage(err)); }
    finally { setIsLoading(false); }
  }, [workspace]);

  const fetchStats = useCallback(async () => {
    if (!workspace) return;
    try {
      const { data } = await taskApi.stats(workspace.id);
      setStats(data);
    } catch { /* silent */ }
  }, [workspace]);

  const createTask = useCallback(async (data: TaskRequest) => {
    if (!workspace) return;
    const { data: created } = await taskApi.create(workspace.id, data);
    setTasks((prev) => [...prev, created]);
    fetchStats();
    return created;
  }, [workspace, fetchStats]);

  const updateTask = useCallback(async (id: number, data: TaskRequest) => {
    if (!workspace) return;
    const { data: updated } = await taskApi.update(workspace.id, id, data);
    setTasks((prev) => prev.map((t) => t.id === id ? updated : t));
    fetchStats();
    return updated;
  }, [workspace, fetchStats]);

  const deleteTask = useCallback(async (id: number) => {
    if (!workspace) return;
    await taskApi.delete(workspace.id, id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    fetchStats();
  }, [workspace, fetchStats]);

  const toggleTask = useCallback(async (id: number) => {
    if (!workspace) return;
    const { data: updated } = await taskApi.toggle(workspace.id, id);
    setTasks((prev) => prev.map((t) => t.id === id ? updated : t));
    fetchStats();
    return updated;
  }, [workspace, fetchStats]);

  useEffect(() => { fetchTasks(); fetchStats(); }, [fetchTasks, fetchStats]);

  return { tasks, stats, isLoading, error, fetchTasks, fetchStats, createTask, updateTask, deleteTask, toggleTask };
}
