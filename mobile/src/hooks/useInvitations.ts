import { useState, useCallback, useEffect } from 'react';
import { invitationApi } from '@/api/endpoints';
import { useWorkspace } from '@/context/WorkspaceContext';
import { extractErrorMessage } from '@/utils/errors';
import type { InvitationResponse, InvitationRequest, TemplateResponse, ExportFormat } from '@/types/api';

export function useInvitations() {
  const { workspace } = useWorkspace();
  const [invitations, setInvitations] = useState<InvitationResponse[]>([]);
  const [templates, setTemplates] = useState<TemplateResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInvitations = useCallback(async () => {
    if (!workspace) return;
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await invitationApi.list(workspace.id);
      setInvitations(data);
    } catch (err) { setError(extractErrorMessage(err)); }
    finally { setIsLoading(false); }
  }, [workspace]);

  const fetchTemplates = useCallback(async () => {
    if (!workspace) return;
    try {
      const { data } = await invitationApi.templates(workspace.id);
      setTemplates(data);
    } catch { /* silent */ }
  }, [workspace]);

  const createInvitation = useCallback(async (data: InvitationRequest) => {
    if (!workspace) return;
    const { data: created } = await invitationApi.create(workspace.id, data);
    setInvitations((prev) => [...prev, created]);
    return created;
  }, [workspace]);

  const updateInvitation = useCallback(async (id: number, data: InvitationRequest) => {
    if (!workspace) return;
    const { data: updated } = await invitationApi.update(workspace.id, id, data);
    setInvitations((prev) => prev.map((i) => i.id === id ? updated : i));
    return updated;
  }, [workspace]);

  const deleteInvitation = useCallback(async (id: number) => {
    if (!workspace) return;
    await invitationApi.delete(workspace.id, id);
    setInvitations((prev) => prev.filter((i) => i.id !== id));
  }, [workspace]);

  const generateInvitation = useCallback(async (id: number, format: ExportFormat = 'PDF') => {
    if (!workspace) return;
    const { data: updated } = await invitationApi.generate(workspace.id, id, format);
    setInvitations((prev) => prev.map((i) => i.id === id ? updated : i));
    return updated;
  }, [workspace]);

  const generateBatch = useCallback(async (templateId?: string, format: ExportFormat = 'PDF') => {
    if (!workspace) return;
    await invitationApi.generateBatch(workspace.id, templateId, format);
  }, [workspace]);

  useEffect(() => { fetchInvitations(); fetchTemplates(); }, [fetchInvitations, fetchTemplates]);

  return {
    invitations, templates, isLoading, error,
    fetchInvitations, fetchTemplates,
    createInvitation, updateInvitation, deleteInvitation,
    generateInvitation, generateBatch,
  };
}
