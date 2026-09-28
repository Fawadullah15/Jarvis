export type JARVISState = 'IDLE' | 'LISTENING' | 'THINKING' | 'EXECUTING' | 'SPEAKING' | 'ERROR';

export type TaskState = 
  | 'Planning' 
  | 'Waiting for permission' 
  | 'Executing' 
  | 'Verifying' 
  | 'Completed' 
  | 'Failed' 
  | 'Cancelled';

export interface TaskStep {
  id: string;
  title: string;
  tool: string;
  input: Record<string, any>;
  output?: any;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'verifying';
  verification?: {
    required: boolean;
    description: string;
    verified: boolean;
    note?: string;
  };
  dangerous?: boolean;
  error?: string;
}

export interface Task {
  id: string;
  userRequest: string;
  state: TaskState;
  currentStepIndex: number;
  steps: TaskStep[];
  createdAt: number;
  updatedAt: number;
  result?: string;
  error?: string;
  pendingPermission?: {
    stepId: string;
    action: string;
    description: string;
    payload: any;
    dangerLevel: 'low' | 'medium' | 'high';
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'jarvis' | 'system' | 'agent';
  text: string;
  timestamp: number;
  taskId?: string;
  toolExecution?: {
    tool: string;
    input: any;
    output: any;
    verified?: boolean;
    isError?: boolean;
  };
  permissionRequest?: {
    stepId: string;
    action: string;
    description: string;
    payload: any;
    dangerLevel: 'low' | 'medium' | 'high';
  };
  attachments?: Array<{
    name: string;
    type: 'image' | 'code' | 'file' | 'screenshot';
    content?: string;
    size?: string;
    url?: string;
  }>;
}

export interface SystemProcess {
  pid: number;
  name: string;
  cpu: number;
  memory: number;
  user?: string;
}

export interface SystemTelemetry {
  cpu: {
    usage: number;
    cores: number;
    model: string;
    temperature?: number;
  };
  memory: {
    total: number; // in GB
    used: number;
    free: number;
    percentage: number;
  };
  disk: {
    total: number;
    used: number;
    free: number;
    percentage: number;
  };
  os: {
    platform: string;
    release: string;
    hostname: string;
    uptime: number;
  };
  processes: SystemProcess[];
  activeApp: string;
}

export interface MemoryItem {
  id: string;
  category: 'Preferences' | 'Projects' | 'People' | 'Work Context' | 'Important Facts' | 'Instructions';
  key: string;
  value: string;
  updatedAt: number;
}

export interface AutomationRule {
  id: string;
  title: string;
  trigger: string;
  action: string;
  enabled: boolean;
  lastRun?: number;
}

export interface PermissionSettings {
  autoAllowOpenApps: boolean;
  alwaysAskFileDelete: boolean;
  alwaysAskTerminalCommands: boolean;
  alwaysAskProcessStop: boolean;
  trustedWorkspacePaths: string[];
}

export interface ProjectContext {
  activePath: string;
  name: string;
  technology: string;
  gitBranch?: string;
  gitStatus?: string;
  files: string[];
  scripts: string[];
  testCommand?: string;
}

export interface LocalAgentStatus {
  connected: boolean;
  mode: 'built-in' | 'external-windows';
  host: string;
  token: string;
  version: string;
  latencyMs: number;
  capabilities: string[];
  lastHeartbeat: number;
}

export interface HealthCheckItem {
  id: string;
  name: string;
  category: string;
  status: 'working' | 'needs-setup' | 'unavailable';
  details: string;
  latency?: string;
}
