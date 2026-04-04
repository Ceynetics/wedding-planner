import { useState, useCallback } from 'react';
import { calendarApi } from '@/api/endpoints';
import { useWorkspace } from '@/context/WorkspaceContext';
import { extractErrorMessage } from '@/utils/errors';
import type { CalendarEventResponse } from '@/types/api';

export function useCalendar() {
  const { workspace } = useWorkspace();
  const [events, setEvents] = useState<CalendarEventResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async (month: string) => {
    if (!workspace) return;
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await calendarApi.getEvents(workspace.id, month);
      setEvents(data);
    } catch (err) { setError(extractErrorMessage(err)); }
    finally { setIsLoading(false); }
  }, [workspace]);

  return { events, isLoading, error, fetchEvents };
}
