import { X, Clock, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

interface Job {
    id: string;
    taskName: string;
    payload: string;
    priority: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    webhookLog?: string | null;
}

interface JobDetailModalProps {
    job: Job;
    onClose: () => void;
}

export default function JobDetailModal({ job, onClose }: JobDetailModalProps) {
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return <Clock className="w-5 h-5 text-yellow-400" />;
            case 'running':
                return <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />;
            case 'completed':
                return <CheckCircle2 className="w-5 h-5 text-green-400" />;
            default:
                return <AlertCircle className="w-5 h-5 text-red-400" />;
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6 z-50 animate-in"
            onClick={onClose}
        >
            <div
                className="bg-slate-800 rounded-2xl border border-slate-700 p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6 border-b border-slate-700 pb-4">
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold text-white">Job Details</h2>
                        <div className={`px-2 py-0.5 rounded text-xs font-mono bg-slate-700 text-slate-300`}>
                            {job.id}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="text-slate-400 text-sm font-medium uppercase tracking-wider">Task Name</label>
                            <p className="text-white font-medium text-lg mt-1">{job.taskName}</p>
                        </div>

                        <div>
                            <label className="text-slate-400 text-sm font-medium uppercase tracking-wider">Status</label>
                            <div className="flex items-center gap-2 mt-1 px-3 py-1.5 bg-slate-900 rounded-lg w-fit border border-slate-700">
                                {getStatusIcon(job.status)}
                                <span className="text-white capitalize font-medium">{job.status}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="text-slate-400 text-sm font-medium uppercase tracking-wider">Priority</label>
                            <p className="text-white mt-1">{job.priority}</p>
                        </div>

                        <div>
                            <label className="text-slate-400 text-sm font-medium uppercase tracking-wider">Timestamps</label>
                            <div className="text-sm text-slate-300 mt-1">
                                <p>Created: {new Date(job.createdAt).toLocaleString()}</p>
                                <p>Updated: {new Date(job.updatedAt).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="text-slate-400 text-sm font-medium uppercase tracking-wider">Payload</label>
                        <div className="relative mt-2">
                            <pre className="bg-slate-950 border border-slate-800 rounded-lg p-4 text-emerald-400 text-sm font-mono overflow-x-auto">
                                {JSON.stringify(JSON.parse(job.payload), null, 2)}
                            </pre>
                        </div>
                    </div>

                    {job.webhookLog && (
                        <div>
                            <label className="text-slate-400 text-sm font-medium uppercase tracking-wider">Webhook Log</label>
                            <div className="mt-2">
                                <p className={`p-4 rounded-lg text-sm border font-mono ${job.webhookLog.startsWith('Success')
                                        ? 'bg-green-500/10 text-green-300 border-green-500/20'
                                        : 'bg-red-500/10 text-red-300 border-red-500/20'
                                    }`}>
                                    {job.webhookLog}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
