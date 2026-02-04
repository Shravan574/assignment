'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import JobForm from '@/components/JobForm';
import JobList from '@/components/JobList';
import JobDetailModal from '@/components/JobDetailModal';
import { Code2, Database, Layout, Server, Terminal, Cpu, Globe } from 'lucide-react';

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

export default function Home() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);

    // Filter states
    const [statusFilter, setStatusFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');

    const fetchJobs = async () => {
        try {
            const response = await axios.get(`${API_URL}/jobs`);
            setJobs(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching jobs:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
        const interval = setInterval(fetchJobs, 2000); // Poll every 2 seconds
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        let filtered = jobs;
        if (statusFilter) {
            filtered = filtered.filter(job => job.status === statusFilter);
        }
        if (priorityFilter) {
            filtered = filtered.filter(job => job.priority === priorityFilter);
        }
        setFilteredJobs(filtered);
    }, [statusFilter, priorityFilter, jobs]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 selection:bg-blue-500/30">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-10 text-center space-y-2">
                    <div className="inline-block p-2 bg-blue-500/10 rounded-2xl mb-2 backdrop-blur-sm border border-blue-500/20">
                        <span className="text-blue-400 text-xs font-bold px-2 uppercase tracking-[0.2em]">Full Stack Assignment</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent drop-shadow-lg">
                        Dotix Job Scheduler
                    </h1>
                    <p className="text-slate-400 text-lg font-light tracking-wide max-w-2xl mx-auto">
                        A robust task orchestration system built to demonstrate proficiency in <strong>System Design</strong>, <strong>Background Processing</strong>, and <strong>Full Stack Development</strong>.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Create Job Form */}
                    <div className="lg:col-span-1 sticky top-6">
                        <JobForm onJobCreated={fetchJobs} />

                        <div className="mt-6 p-6 bg-slate-900/30 border border-slate-800 rounded-2xl">
                            <h3 className="text-slate-400 font-semibold mb-3 flex items-center gap-2">
                                <Code2 className="w-4 h-4 text-emerald-400" /> Tech Stack Used
                            </h3>
                            <div className="flex flex-wrap gap-2 text-xs">
                                <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700 text-slate-300 flex items-center gap-1"><Layout className="w-3 h-3" /> Next.js 15</span>
                                <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700 text-slate-300 flex items-center gap-1"><Code2 className="w-3 h-3" /> TypeScript</span>
                                <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700 text-slate-300 flex items-center gap-1"><Globe className="w-3 h-3" /> Tailwind</span>
                                <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700 text-slate-300 flex items-center gap-1"><Server className="w-3 h-3" /> Node/Express</span>
                                <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700 text-slate-300 flex items-center gap-1"><Database className="w-3 h-3" /> Prisma/SQLite</span>
                                <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700 text-slate-300 flex items-center gap-1"><Cpu className="w-3 h-3" /> Async Workers</span>
                            </div>
                        </div>

                        <div className="mt-6 p-6 bg-slate-900/30 border border-slate-800 rounded-2xl text-slate-500 text-sm">
                            <h3 className="text-slate-400 font-semibold mb-2 flex items-center gap-2">
                                <Terminal className="w-4 h-4 text-blue-400" /> How to Test
                            </h3>
                            <ul className="list-disc pl-4 space-y-2">
                                <li>Create a new job using the form above.</li>
                                <li>Observe the job appear in the <strong>Dashboard</strong> with <span className="text-yellow-500">pending</span> status.</li>
                                <li>Click the <strong className="text-blue-400">Run</strong> button to start the backend worker.</li>
                                <li>Wait 3 seconds for the simulated processing to complete.</li>
                                <li>Verify the status updates to <span className="text-green-500">completed</span> and webhook fires.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Jobs Dashboard */}
                    <div className="lg:col-span-2">
                        <JobList
                            jobs={filteredJobs}
                            loading={loading}
                            onJobSelect={setSelectedJob}
                            onRefresh={fetchJobs}
                            statusFilter={statusFilter}
                            setStatusFilter={setStatusFilter}
                            priorityFilter={priorityFilter}
                            setPriorityFilter={setPriorityFilter}
                        />
                    </div>
                </div>

                {/* Job Detail Modal */}
                {selectedJob && (
                    <JobDetailModal
                        job={selectedJob}
                        onClose={() => setSelectedJob(null)}
                    />
                )}

                <div className="mt-12 border-t border-slate-800/50 pt-8 text-center pb-6">
                    <p className="text-slate-500 text-sm">
                        Designed & Developed by <strong>Candidate</strong> for Dotix Technologies Assignment.
                    </p>
                    <p className="text-slate-600 text-xs mt-2">
                        Built with Next.js App Router, Server Actions, and Modern UI Patterns.
                    </p>
                </div>
            </div>
        </div>
    );
}
