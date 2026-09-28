import React, { useState } from 'react';
import { 
  Activity, 
  Cpu, 
  HardDrive, 
  Layers, 
  Database, 
  Shield, 
  FolderTree, 
  Terminal, 
  FileCode2, 
  RefreshCw, 
  Trash2, 
  Plus, 
  ExternalLink,
  Search,
  CheckCircle,
  Play
} from 'lucide-react';
import { 
  SystemTelemetry, 
  Task, 
  MemoryItem, 
  PermissionSettings 
} from '../types/jarvis';
import { TaskVisualization } from './TaskVisualization';

interface RightSidebarProps {
  activeTask: Task | null;
  telemetry: SystemTelemetry | null;
  memories: MemoryItem[];
  permissions: PermissionSettings;
  onUpdatePermissions: (newPerms: PermissionSettings) => void;
  onAddMemory: (category: MemoryItem['category'], key: string, value: string) => void;
  onDeleteMemory: (id: string) => void;
  onApprovePermission?: (stepId: string) => void;
  onRejectPermission?: (stepId: string) => void;
  onCancelTask?: (taskId: string) => void;
  onRefreshTelemetry: () => void;
  onRunDiagnoseSlowdown: () => void;
  workspaceFiles: Array<{ name: string; isDirectory: boolean; path: string }>;
  onOpenFileContent: (path: string) => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  activeTask,
  telemetry,
  memories,
  permissions,
  onUpdatePermissions,
  onAddMemory,
  onDeleteMemory,
  onApprovePermission,
  onRejectPermission,
  onCancelTask,
  onRefreshTelemetry,
  onRunDiagnoseSlowdown,
  workspaceFiles,
  onOpenFileContent,
}) => {
  const [activeTab, setActiveTab] = useState<'task' | 'system' | 'files' | 'memory' | 'security'>('system');
  const [memoryFilter, setMemoryFilter] = useState<string>('All');
  const [newMemKey, setNewMemKey] = useState('');
  const [newMemVal, setNewMemVal] = useState('');
  const [newMemCat, setNewMemCat] = useState<MemoryItem['category']>('Preferences');
  const [showAddMem, setShowAddMem] = useState(false);
  const [processFilter, setProcessFilter] = useState('');

  const filteredProcesses = telemetry?.processes.filter(p => 
    p.name.toLowerCase().includes(processFilter.toLowerCase()) || 
    String(p.pid).includes(processFilter)
  ) || [];

  return (
    <aside className="w-84 bg-[#090d16]/95 border-l border-cyan-500/15 flex flex-col h-full select-none shrink-0 z-20">
      {/* Tab Navigation Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 p-2 bg-slate-950/40">
        <div className="flex items-center gap-1 overflow-x-auto text-xs py-1">
          <button
            onClick={() => setActiveTab('task')}
            className={`px-2.5 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'task' 
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Task</span>
            {activeTask && (
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('system')}
            className={`px-2.5 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'system' 
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>System</span>
          </button>

          <button
            onClick={() => setActiveTab('files')}
            className={`px-2.5 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'files' 
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FolderTree className="w-3.5 h-3.5" />
            <span>Files</span>
          </button>

          <button
            onClick={() => setActiveTab('memory')}
            className={`px-2.5 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'memory' 
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Memory</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`px-2.5 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'security' 
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Security</span>
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto p-3.5">
        
        {/* TAB 1: TASK EXECUTION */}
        {activeTab === 'task' && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Execution Engine</span>
              <span className="text-[11px] font-mono text-cyan-400">
                {activeTask ? activeTask.state : 'No Active Task'}
              </span>
            </div>

            {activeTask ? (
              <TaskVisualization
                task={activeTask}
                onApprovePermission={onApprovePermission}
                onRejectPermission={onRejectPermission}
                onCancelTask={onCancelTask}
              />
            ) : (
              <div className="text-center py-12 px-4 rounded-xl border border-dashed border-slate-800 text-slate-500">
                <Activity className="w-8 h-8 mx-auto text-slate-600 mb-2 opacity-50" />
                <p className="text-xs font-medium text-slate-400">System is idle</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Ask JARVIS to run a multi-step task, build code, or control your PC.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SYSTEM MONITOR */}
        {activeTab === 'system' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Live Hardware Telemetry</span>
              <button
                onClick={onRefreshTelemetry}
                className="p-1 rounded text-slate-400 hover:text-cyan-400 transition-colors"
                title="Refresh hardware stats"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Gauges Cards */}
            <div className="grid grid-cols-3 gap-2">
              {/* CPU Gauge */}
              <div className="p-3 rounded-xl bg-slate-900/60 border border-cyan-500/20 text-center">
                <div className="text-[10px] font-mono text-slate-400 uppercase">CPU Load</div>
                <div className="text-xl font-bold font-mono text-cyan-300 mt-1">
                  {telemetry ? `${telemetry.cpu.usage}%` : '--%'}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {telemetry ? `${telemetry.cpu.cores} Cores` : '8 Cores'}
                </div>
              </div>

              {/* Memory Gauge */}
              <div className="p-3 rounded-xl bg-slate-900/60 border border-sky-500/20 text-center">
                <div className="text-[10px] font-mono text-slate-400 uppercase">RAM</div>
                <div className="text-xl font-bold font-mono text-sky-300 mt-1">
                  {telemetry ? `${telemetry.memory.percentage}%` : '--%'}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {telemetry ? `${telemetry.memory.used}GB / ${telemetry.memory.total}GB` : 'RAM'}
                </div>
              </div>

              {/* Disk Gauge */}
              <div className="p-3 rounded-xl bg-slate-900/60 border border-indigo-500/20 text-center">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Storage</div>
                <div className="text-xl font-bold font-mono text-indigo-300 mt-1">
                  {telemetry ? `${telemetry.disk.percentage}%` : '40%'}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {telemetry ? `${telemetry.disk.free}GB Free` : '612GB Free'}
                </div>
              </div>
            </div>

            {/* Slowdown Diagnosis Trigger */}
            <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/30 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-cyan-200">Slowdown Diagnosis</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Analyze process tree for bottlenecks</div>
              </div>
              <button
                onClick={onRunDiagnoseSlowdown}
                className="px-2.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono transition-colors"
              >
                Inspect
              </button>
            </div>

            {/* Active Processes */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Running Processes</span>
                <span className="text-[10px] font-mono text-slate-500">
                  {telemetry?.processes.length || 0} active
                </span>
              </div>

              <div className="relative mb-2">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Filter processes..."
                  value={processFilter}
                  onChange={(e) => setProcessFilter(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {filteredProcesses.map((proc, idx) => (
                  <div
                    key={`${proc.pid}-${proc.name}-${idx}`}
                    className="p-2 rounded-lg bg-slate-900/40 border border-slate-800/80 flex items-center justify-between text-xs font-mono"
                  >
                    <div>
                      <div className="font-medium text-slate-200 truncate">{proc.name}</div>
                      <div className="text-[10px] text-slate-500">PID: {proc.pid}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-cyan-400 text-xs">{proc.cpu}% CPU</div>
                      <div className="text-[10px] text-slate-500">{proc.memory} MB</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* OS Host Details */}
            {telemetry && (
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-[11px] font-mono space-y-1 text-slate-400">
                <div className="flex justify-between">
                  <span>OS:</span>
                  <span className="text-slate-300">{telemetry.os.platform}</span>
                </div>
                <div className="flex justify-between">
                  <span>Hostname:</span>
                  <span className="text-slate-300">{telemetry.os.hostname}</span>
                </div>
                <div className="flex justify-between">
                  <span>Uptime:</span>
                  <span className="text-slate-300">{(telemetry.os.uptime / 3600).toFixed(1)} hrs</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: WORKSPACE FILES */}
        {activeTab === 'files' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Workspace Files</span>
              <span className="text-[10px] font-mono text-cyan-400">./workspace</span>
            </div>

            <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
              {workspaceFiles.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">
                  Workspace empty. Ask JARVIS to create files or folders.
                </div>
              ) : (
                workspaceFiles.map((file, idx) => (
                  <div
                    key={`${file.path}-${idx}`}
                    onClick={() => onOpenFileContent(file.path)}
                    className="p-2 rounded-lg bg-slate-900/40 hover:bg-slate-850 border border-slate-800/80 hover:border-cyan-500/30 flex items-center justify-between text-xs cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2 truncate">
                      {file.isDirectory ? (
                        <FolderTree className="w-4 h-4 text-cyan-400 shrink-0" />
                      ) : file.name.endsWith('.py') ? (
                        <FileCode2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <FileCode2 className="w-4 h-4 text-sky-400 shrink-0" />
                      )}
                      <span className="text-slate-200 truncate font-mono text-xs">{file.name}</span>
                    </div>

                    <span className="text-[10px] font-mono text-slate-500">
                      {file.isDirectory ? 'dir' : 'file'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 4: MEMORY */}
        {activeTab === 'memory' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Persistent Memory</span>
              <button
                onClick={() => setShowAddMem(!showAddMem)}
                className="px-2 py-1 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Remember</span>
              </button>
            </div>

            {/* Add Memory Form */}
            {showAddMem && (
              <div className="p-3 rounded-lg bg-slate-900 border border-cyan-500/40 space-y-2 text-xs">
                <select
                  value={newMemCat}
                  onChange={(e) => setNewMemCat(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-slate-200"
                >
                  <option value="Preferences">Preferences</option>
                  <option value="Projects">Projects</option>
                  <option value="People">People</option>
                  <option value="Work Context">Work Context</option>
                  <option value="Important Facts">Important Facts</option>
                  <option value="Instructions">Instructions</option>
                </select>
                <input
                  type="text"
                  placeholder="Key (e.g. Preferred Language)"
                  value={newMemKey}
                  onChange={(e) => setNewMemKey(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-slate-200"
                />
                <textarea
                  placeholder="Value / instruction to remember..."
                  value={newMemVal}
                  onChange={(e) => setNewMemVal(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-slate-200 h-16 resize-none"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowAddMem(false)}
                    className="px-2.5 py-1 rounded bg-slate-800 text-slate-400 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (newMemKey && newMemVal) {
                        onAddMemory(newMemCat, newMemKey, newMemVal);
                        setNewMemKey('');
                        setNewMemVal('');
                        setShowAddMem(false);
                      }
                    }}
                    className="px-2.5 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium"
                  >
                    Save Memory
                  </button>
                </div>
              </div>
            )}

            {/* Memory List */}
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {memories.map((mem, idx) => (
                <div
                  key={`${mem.id}-${idx}`}
                  className="p-2.5 rounded-lg bg-slate-900/40 border border-slate-800/80 text-xs space-y-1 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      {mem.category}
                    </span>
                    <button
                      onClick={() => onDeleteMemory(mem.id)}
                      className="text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Forget this"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="font-semibold text-slate-200">{mem.key}</div>
                  <div className="text-slate-400 text-[11px] leading-relaxed">{mem.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: SECURITY & PERMISSIONS */}
        {activeTab === 'security' && (
          <div className="space-y-4 text-xs">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Security Model</span>
              <p className="text-[11px] text-slate-400 mt-1">
                Configure when JARVIS should execute automatically versus request explicit human approval.
              </p>
            </div>

            <div className="space-y-3">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={permissions.autoAllowOpenApps}
                  onChange={(e) => onUpdatePermissions({ ...permissions, autoAllowOpenApps: e.target.checked })}
                  className="mt-0.5 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
                />
                <div>
                  <div className="font-medium text-slate-200">Always allow opening applications</div>
                  <div className="text-[11px] text-slate-400">Launch VS Code, Chrome, or utilities without prompting.</div>
                </div>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={permissions.alwaysAskFileDelete}
                  onChange={(e) => onUpdatePermissions({ ...permissions, alwaysAskFileDelete: e.target.checked })}
                  className="mt-0.5 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
                />
                <div>
                  <div className="font-medium text-slate-200">Always ask before deleting files</div>
                  <div className="text-[11px] text-slate-400">Never delete or overwrite without explicit confirmation card.</div>
                </div>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={permissions.alwaysAskTerminalCommands}
                  onChange={(e) => onUpdatePermissions({ ...permissions, alwaysAskTerminalCommands: e.target.checked })}
                  className="mt-0.5 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
                />
                <div>
                  <div className="font-medium text-slate-200">Always ask before running shell commands</div>
                  <div className="text-[11px] text-slate-400">Prompt before executing terminal commands in powershell or bash.</div>
                </div>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={permissions.alwaysAskProcessStop}
                  onChange={(e) => onUpdatePermissions({ ...permissions, alwaysAskProcessStop: e.target.checked })}
                  className="mt-0.5 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
                />
                <div>
                  <div className="font-medium text-slate-200">Always ask before terminating processes</div>
                  <div className="text-[11px] text-slate-400">Prevent stopping running services without explicit approval.</div>
                </div>
              </label>
            </div>

            <div className="pt-3 border-t border-slate-800">
              <div className="font-medium text-slate-300 mb-1">Local Agent Secret Token</div>
              <div className="p-2 rounded bg-black/50 font-mono text-[11px] text-cyan-400 border border-slate-800">
                JARVIS-SECURE-KEY-8821
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                Bound to 127.0.0.1:48293. Rejecting unauthorized web requests.
              </div>
            </div>
          </div>
        )}

      </div>
    </aside>
  );
};
