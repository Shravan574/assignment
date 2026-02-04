import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 1. POST /jobs (create job)
app.post('/jobs', async (req, res) => {
    try {
        const { taskName, payload, priority } = req.body;

        if (!taskName || !payload || !priority) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Validate payload is valid JSON
        try {
            if (typeof payload === 'string') {
                JSON.parse(payload);
            } else {
                JSON.stringify(payload);
            }
        } catch (e) {
            return res.status(400).json({ error: 'Payload must be valid JSON' });
        }

        const job = await prisma.job.create({
            data: {
                taskName,
                payload: typeof payload === 'string' ? payload : JSON.stringify(payload),
                priority,
                status: 'pending',
            },
        });

        res.status(201).json(job);
    } catch (error) {
        console.error('Error creating job:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 2. GET /jobs (list jobs)
app.get('/jobs', async (req, res) => {
    try {
        const { status, priority } = req.query;
        const filter: any = {};

        if (status) filter.status = status;
        if (priority) filter.priority = priority;

        const jobs = await prisma.job.findMany({
            where: filter,
            orderBy: { createdAt: 'desc' },
        });

        res.json(jobs);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 3. GET /jobs/:id (job detail)
app.get('/jobs/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const job = await prisma.job.findUnique({
            where: { id },
        });

        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        res.json(job);
    } catch (error) {
        console.error('Error fetching job:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 4. POST /run-job/:id (simulate processing)
app.post('/run-job/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const job = await prisma.job.findUnique({ where: { id } });

        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        if (job.status === 'running') {
            return res.status(400).json({ error: 'Job is already running' });
        }

        // Update status to running
        await prisma.job.update({
            where: { id },
            data: { status: 'running' },
        });

        // Run processing in background
        (async () => {
            console.log(`Starting job ${id}...`);
            await new Promise((resolve) => setTimeout(resolve, 3000));

            const updatedJob = await prisma.job.update({
                where: { id },
                data: { status: 'completed' },
            });

            console.log(`Job ${id} completed. Triggering webhook...`);

            // Trigger outbound webhook
            const webhookUrl = process.env.WEBHOOK_URL || 'https://webhook.site/58c3f25c-097d-4bfa-9486-ed5015b63cf2';

            const webhookPayload = {
                jobId: updatedJob.id,
                taskName: updatedJob.taskName,
                priority: updatedJob.priority,
                payload: JSON.parse(updatedJob.payload),
                completedAt: updatedJob.updatedAt,
            };

            try {
                const response = await axios.post(webhookUrl, webhookPayload);
                await prisma.job.update({
                    where: { id },
                    data: {
                        webhookLog: `Success: ${response.status}`
                    },
                });
                console.log(`Webhook for job ${id} sent successfully.`);
            } catch (webhookError: any) {
                console.error(`Webhook for job ${id} failed:`, webhookError.message);
                await prisma.job.update({
                    where: { id },
                    data: {
                        webhookLog: `Error: ${webhookError.message}`
                    },
                });
            }
        })();

        res.json({ message: 'Job started successfully', jobId: id });
    } catch (error) {
        console.error('Error running job:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 5. POST /webhook-test (optional; local webhook receiver for testing)
app.post('/webhook-test', (req, res) => {
    console.log('--- RECEIVED WEBHOOK ---');
    console.log('Payload:', JSON.stringify(req.body, null, 2));
    console.log('------------------------');
    res.status(200).send('Webhook received');
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
