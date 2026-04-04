import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { workspaceApi } from '@/api/endpoints';
import { useAuth } from './AuthContext';
import type { WorkspaceResponse, WorkspaceRequest } from '@/types/api';

interface WorkspaceContextType {
  workspace: WorkspaceResponse | null;
  workspaces: WorkspaceResponse[];
  isLoading: boolean;
  selectWorkspace: (id: number) => void;
  refreshWorkspaces: () => Promise<void>;
  createWorkspace: (data: WorkspaceRequest) => Promise<WorkspaceResponse>;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [workspace, setWorkspace] = useState<WorkspaceResponse | null>(null);
  const [workspaces, setWorkspaces] = useState<WorkspaceResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshWorkspaces = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const { data } = await workspaceApi.list();
      setWorkspaces(data);
      if (data.length > 0 && !workspace) {
        setWorkspace(data[0]);
      }
    } catch {
      // silently fail -- workspaces will be empty
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, workspace]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshWorkspaces();
    } else {
      setWorkspace(null);
      setWorkspaces([]);
    }
  }, [isAuthenticated]);

  const selectWorkspace = useCallback((id: number) => {
    const found = workspaces.find((w) => w.id === id);
    if (found) setWorkspace(found);
  }, [workspaces]);

  const createWorkspace = useCallback(async (data: WorkspaceRequest): Promise<WorkspaceResponse> => {
    const { data: created } = await workspaceApi.create(data);
    setWorkspaces((prev) => [...prev, created]);
    setWorkspace(created);
    return created;
  }, []);

  return (
    <WorkspaceContext.Provider value={{ workspace, workspaces, isLoading, selectWorkspace, refreshWorkspaces, createWorkspace }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace(): WorkspaceContextType {
  const context = useContext(WorkspaceContext);
  if (!context) throw new Error('useWorkspace must be used within WorkspaceProvider');
  return context;
}
