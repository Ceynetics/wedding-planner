import { Redirect } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { useWorkspace } from "@/context/WorkspaceContext";
import LoadingOverlay from "@/components/LoadingOverlay";

export default function Index() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { workspace, isLoading: workspaceLoading } = useWorkspace();

  if (authLoading || (isAuthenticated && workspaceLoading)) {
    return <LoadingOverlay />;
  }

  if (!isAuthenticated) {
    return <Redirect href={"/(onboard)/onboard_one" as any} />;
  }

  if (!workspace) {
    return <Redirect href={"/(onboard)/workspace" as any} />;
  }

  return <Redirect href={"/(tabs)" as any} />;
}
