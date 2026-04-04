import { useState, useCallback, useEffect } from 'react';
import { expenseApi } from '@/api/endpoints';
import { useWorkspace } from '@/context/WorkspaceContext';
import { extractErrorMessage } from '@/utils/errors';
import type { ExpenseResponse, ExpenseRequest, BudgetSummaryResponse } from '@/types/api';

export function useExpenses() {
  const { workspace } = useWorkspace();
  const [expenses, setExpenses] = useState<ExpenseResponse[]>([]);
  const [summary, setSummary] = useState<BudgetSummaryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = useCallback(async () => {
    if (!workspace) return;
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await expenseApi.list(workspace.id);
      setExpenses(data);
    } catch (err) { setError(extractErrorMessage(err)); }
    finally { setIsLoading(false); }
  }, [workspace]);

  const fetchSummary = useCallback(async () => {
    if (!workspace) return;
    try {
      const { data } = await expenseApi.summary(workspace.id);
      setSummary(data);
    } catch { /* silent */ }
  }, [workspace]);

  const createExpense = useCallback(async (data: ExpenseRequest) => {
    if (!workspace) return;
    const { data: created } = await expenseApi.create(workspace.id, data);
    setExpenses((prev) => [...prev, created]);
    fetchSummary();
    return created;
  }, [workspace, fetchSummary]);

  const updateExpense = useCallback(async (id: number, data: ExpenseRequest) => {
    if (!workspace) return;
    const { data: updated } = await expenseApi.update(workspace.id, id, data);
    setExpenses((prev) => prev.map((e) => e.id === id ? updated : e));
    fetchSummary();
    return updated;
  }, [workspace, fetchSummary]);

  const deleteExpense = useCallback(async (id: number) => {
    if (!workspace) return;
    await expenseApi.delete(workspace.id, id);
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    fetchSummary();
  }, [workspace, fetchSummary]);

  useEffect(() => { fetchExpenses(); fetchSummary(); }, [fetchExpenses, fetchSummary]);

  return { expenses, summary, isLoading, error, fetchExpenses, fetchSummary, createExpense, updateExpense, deleteExpense };
}
