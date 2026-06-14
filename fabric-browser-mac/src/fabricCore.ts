export interface FabricCoreAction {
  id: string;
  label: string;
  description: string;
  mode: string;
  script: string;
}

export interface FabricCoreActionsResponse {
  version: string;
  nativeRule: string;
  actions: FabricCoreAction[];
}

export interface FabricCoreActionOutput {
  action_id: string;
  status: string;
  stdout: string;
  stderr: string;
}

interface TauriBridge {
  invoke<T>(command: string, args?: Record<string, unknown>): Promise<T>;
}

function bridge(): TauriBridge | null {
  return (window as unknown as { __TAURI__?: { core?: TauriBridge } }).__TAURI__?.core ?? null;
}

export function isFabricCoreNative(): boolean {
  return bridge() !== null;
}

export async function listFabricCoreActions(): Promise<FabricCoreAction[]> {
  const native = bridge();
  if (!native) return [];
  const response = await native.invoke<FabricCoreActionsResponse>("list_fabric_core_actions");
  return response.actions;
}

export async function executeFabricCoreAction(actionId: string): Promise<FabricCoreActionOutput> {
  const native = bridge();
  if (!native) {
    throw new Error("Fabric Core native bridge is only available inside Fabric Mac Core.app");
  }
  return native.invoke<FabricCoreActionOutput>("execute_fabric_core_action", { action_id: actionId });
}
