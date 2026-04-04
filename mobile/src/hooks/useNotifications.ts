import { useState, useCallback, useEffect } from 'react';
import { notificationApi } from '@/api/endpoints';
import { useWorkspace } from '@/context/WorkspaceContext';
import { extractErrorMessage } from '@/utils/errors';
import type { NotificationResponse, NotificationType, NotificationPriority } from '@/types/api';

export function useNotifications() {
  const { workspace } = useWorkspace();
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async (params?: { type?: NotificationType; priority?: NotificationPriority }) => {
    if (!workspace) return;
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await notificationApi.list(workspace.id, params);
      setNotifications(data);
    } catch (err) { setError(extractErrorMessage(err)); }
    finally { setIsLoading(false); }
  }, [workspace]);

  const fetchUnreadCount = useCallback(async () => {
    if (!workspace) return;
    try {
      const { data } = await notificationApi.unreadCount(workspace.id);
      setUnreadCount(data.count);
    } catch { /* silent */ }
  }, [workspace]);

  const markAsRead = useCallback(async (id: number) => {
    if (!workspace) return;
    const { data: updated } = await notificationApi.markAsRead(workspace.id, id);
    setNotifications((prev) => prev.map((n) => n.id === id ? updated : n));
    fetchUnreadCount();
  }, [workspace, fetchUnreadCount]);

  const markAllAsRead = useCallback(async () => {
    if (!workspace) return;
    await notificationApi.markAllAsRead(workspace.id);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  }, [workspace]);

  useEffect(() => { fetchNotifications(); fetchUnreadCount(); }, [fetchNotifications, fetchUnreadCount]);

  return { notifications, unreadCount, isLoading, error, fetchNotifications, fetchUnreadCount, markAsRead, markAllAsRead };
}
