import { Filter, Play, Clock, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

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

interface JobListProps {
    jobs: Job[];
    loading: boolean;
    onJobSelect: (job: Job) => void;
    onRefresh: () => void;
    statusFilter: string;
    setStatusFilter: (status: string) => void;
    priorityFilter: string;
    setPriorityFilter: (priority: string) => void;
}

export default function JobList({
    jobs,
    loading,
    onJobSelect,
    onRefresh,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter
}: JobListProps) {

    const runJob = async (id: string) => {
        try {
            await axios.post(`${API_URL}/run-job/${id}`);
            onRefresh();
        } catch (error) {
            console.error('Error running job:', error);
            alert('Failed to run job.');
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return <Clock className="w-4 h-4 text-yellow-400" />;
            case 'running':
                return <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />;
            case 'completed':
                return <CheckCircle2 className="w-4 h-4 text-green-400" />;
            default:
                return <AlertCircle className="w-4 h-4 text-red-400" />;
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'High':
                return 'bg-red-500/20 text-red-300 border-red-500/50';
            case 'Medium':
                return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
            case 'Low':
                return 'bg-green-500/20 text-green-300 border-green-500/50';
            default:
                return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
        }
    };

    return (
        <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl border border-slate-700/50 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Jobs Dashboard</h2>
                <div className="flex gap-2">
                    <Filter className="w-5 h-5 text-slate-400" />
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="running">Running</option>
                    <option value="completed">Completed</option>
                </select>

                <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">All Priority</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>
            </div>

            {/* Jobs Table */}
            <div className="overflow-x-auto min-h-[400px]">
                {loading && jobs.length === 0 ? (
                    <div className="text-center py-12">
                        <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto" />
                        <p className="text-slate-400 mt-4">Loading jobs...</p>
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-slate-400">No jobs found matching your filters.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {jobs.map((job) => (
                            <div
                                key={job.id}
                                className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 hover:border-blue-500/50 transition-all cursor-pointer group"
                                onClick={() => onJobSelect(job)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 flex-1">
                                        {getStatusIcon(job.status)}
                                        <div className="flex-1">
                                            <h3 className="text-white font-medium group-hover:text-blue-400 transition-colors">{job.taskName}</h3>
                                            <p className="text-slate-500 text-xs mt-1">
                                                ID: <span className="font-mono">{job.id.slice(0, 8)}</span> • {new Date(job.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(job.priority)}`}>
                                            {job.priority}
                                        </span>

                                        {job.status === 'pending' && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    runJob(job.id);
                                                }}
                                                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition text-sm font-medium shadow-lg hover:shadow-blue-500/25"
                                            >
                                                <Play className="w-3 h-3" />
                                                Run
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
