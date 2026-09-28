import React from 'react';
import { Task, TaskStep } from '../types/jarvis';
import { 
  CheckCircle2, 
  Circle, 
  Loader2, 
  AlertTriangle, 
  XCircle, 
  ShieldAlert, 
  Play, 
  Pause, 
  X,
  FileCheck2,
  Terminal,
  FolderPlus,
  Monitor
} from 'lucide-react';

interface TaskVisualizationProps {
  task: Task;
  onApprovePermission?: (stepId: string) => void;
  onRejectPermission?: (stepId: string) => void;
  onCancelTask?: (taskId: string) => void;
}

export const TaskVisualization: React.FC<TaskVisualizationProps> = ({
  task,
  onApprovePermission,
  onRejectPermission,
  onCancelTask,
}) => {
  const completedCount = task.steps.filter(s => s.status === 'completed').length;
  const progressPercent = task.steps.length > 0 
    ? Math.round((completedCount / task.steps.length) * 100) 
    : 0;

  const getToolIcon = (tool: string) => {
    if (tool.includes('filesystem')) return <FolderPlus className="w-3.5 h-3.5 text-cyan-400" />;
    if (tool.includes('terminal')) return <Terminal className="w-3.5 h-3.5 text-emerald-400" />;
    if (tool.includes('computer')) return <Monitor className="w-3.5 h-3.5 text-sky-400" />;
    return <FileCheck2 className="w-3.5 h-3.5 text-violet-400" />;
  };

  return (
    <div className="glass-panel-elevated rounded-xl p-4 my-3 border border-cyan-500/20 shadow-lg text-slate-100 transition-all">
      {/* Task Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <div>
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              TASK: {task.id}
              <span className="text-slate-500">·</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                task.state === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                task.state === 'Waiting for permission' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                task.state === 'Failed' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                'bg-sky-500/10 text-sky-400 border border-sky-500/20'
              }`}>
                {task.state}
              </span>
            </div>
            <h4 className="text-sm font-medium text-slate-200 mt-0.5 line-clamp-1">{task.userRequest}</h4>
          </div>
        </div>

        {task.state === 'Executing' || task.state === 'Waiting for permission' ? (
          <button
            onClick={() => onCancelTask?.(task.id)}
            className="p-1 rounded-md text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Cancel Task"
          >
            <X className="w-4 h-4" />
          </button>
        ) : null}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-900/60 rounded-full h-1.5 mb-3 overflow-hidden border border-slate-800">
        <div 
          className="bg-gradient-to-r from-cyan-500 to-sky-400 h-full transition-all duration-500 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Steps List */}
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {task.steps.map((step, idx) => {
          const isCurrent = idx === task.currentStepIndex && task.state === 'Executing';
          return (
            <div
              key={`${step.id}-${idx}`}
              className={`p-2.5 rounded-lg border text-xs transition-colors ${
                step.status === 'completed'
                  ? 'bg-slate-900/40 border-slate-800/80 text-slate-300'
                  : isCurrent
                  ? 'bg-cyan-950/30 border-cyan-500/40 text-cyan-200'
                  : step.status === 'failed'
                  ? 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                  : 'bg-slate-900/20 border-slate-800/40 text-slate-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {step.status === 'completed' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : step.status === 'running' || isCurrent ? (
                    <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
                  ) : step.status === 'failed' ? (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-600 shrink-0" />
                  )}

                  <span className="font-medium text-slate-200">{step.title}</span>
                </div>

                <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400">
                  {getToolIcon(step.tool)}
                  <span>{step.tool}</span>
                </div>
              </div>

              {/* Verification Badge */}
              {step.verification && step.status === 'completed' && (
                <div className="mt-1.5 ml-6 pt-1.5 border-t border-slate-800/60 flex items-center gap-1.5 text-[11px] text-emerald-400">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>{step.verification.note || 'Verified: output integrity confirmed'}</span>
                </div>
              )}

              {/* Error Note */}
              {step.error && (
                <div className="mt-1.5 ml-6 text-[11px] text-rose-400">
                  {step.error}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Human Confirmation Permission Card */}
      {task.state === 'Waiting for permission' && task.pendingPermission && (
        <div className="mt-4 p-3.5 rounded-lg bg-amber-950/30 border border-amber-500/40 animate-pulse-subtle">
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="text-xs font-semibold text-amber-300">
                Security Approval Required
              </div>
              <p className="text-xs text-amber-200/90 mt-0.5">
                {task.pendingPermission.description}
              </p>
              <div className="mt-2 p-2 rounded bg-black/40 font-mono text-[11px] text-slate-300 border border-amber-500/20">
                Action: {task.pendingPermission.action}
              </div>

              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={() => onApprovePermission?.(task.pendingPermission!.stepId)}
                  className="px-3.5 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors shadow-sm"
                >
                  Approve Execution
                </button>
                <button
                  onClick={() => onRejectPermission?.(task.pendingPermission!.stepId)}
                  className="px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Final Result Notification */}
      {task.state === 'Completed' && task.result && (
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-xs text-cyan-200/90 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {task.result}
          </span>
          <span className="font-mono text-[10px] text-slate-500">100% verified</span>
        </div>
      )}
    </div>
  );
};
