import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface JobFormProps {
    onJobCreated: () => void;
}

export default function JobForm({ onJobCreated }: JobFormProps) {
    const [taskName, setTaskName] = useState('');
    const [payload, setPayload] = useState('{\n  "key": "value"\n}');
    const [priority, setPriority] = useState('Medium');
    const [isLoading, setIsLoading] = useState(false);

    const createJob = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await axios.post(`${API_URL}/jobs`, {
                taskName,
                payload,
                priority,
            });
            setTaskName('');
            setPayload('{\n  "key": "value"\n}');
            setPriority('Medium');
            onJobCreated();
        } catch (error) {
            console.error('Error creating job:', error);
            alert('Failed to create job. Please check the payload format.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl border border-slate-700/50 p-6 shadow-2xl">
            <div className="flex items-center gap-2 mb-6">
                <Plus className="w-5 h-5 text-blue-400" />
                <h2 className="text-xl font-semibold text-white">Create New Job</h2>
            </div>

            <form onSubmit={createJob} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        Task Name
                    </label>
                    <input
                        type="text"
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                        className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        placeholder="e.g., Send Email Report"
                        required
                        disabled={isLoading}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        Payload (JSON)
                    </label>
                    <textarea
                        value={payload}
                        onChange={(e) => setPayload(e.target.value)}
                        className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition font-mono text-sm"
                        rows={6}
                        required
                        disabled={isLoading}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        Priority
                    </label>
                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        disabled={isLoading}
                    >
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-blue-500/50 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    {isLoading ? 'Creating...' : 'Create Job'}
                </button>
            </form>
        </div>
    );
}
