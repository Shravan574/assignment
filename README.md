# Dotix Job Scheduler & Automation System

A full-stack job scheduler and automation dashboard built with **Next.js**, **Express**, **Prisma**, and **SQLite**. This system allows users to create background tasks, run them asynchronously, track their status in real-time, and trigger webhooks upon completion.

---

## 🚀 Features

✅ **Create Jobs** - Define tasks with custom payloads (JSON) and priority levels  
✅ **Run Jobs** - Simulate background processing with 3-second delay  
✅ **Real-time Dashboard** - Track job status (pending/running/completed)  
✅ **Filters** - Filter jobs by status and priority  
✅ **Job Details** - View full job information including payload and webhook logs  
✅ **Webhook Integration** - Automatically trigger outbound webhooks on job completion  
✅ **Modern UI** - Built with Tailwind CSS, dark theme, glassmorphism effects  

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express
- **Language**: TypeScript
- **Database**: SQLite
- **ORM**: Prisma
- **HTTP Client**: Axios (for webhooks)

---

## 📁 Project Structure

```
dotix-job-scheduler/
├── backend/
│   ├── src/
│   │   └── index.ts          # Express server with API endpoints
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   └── migrations/       # Database migrations
│   ├── .env                  # Environment variables
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   └── app/
│   │       ├── page.tsx      # Main dashboard
│   │       ├── layout.tsx    # Root layout
│   │       └── globals.css   # Global styles
│   ├── .env.local            # Frontend environment variables
│   ├── package.json
│   ├── tailwind.config.ts
│   └── tsconfig.json
└── README.md
```

---

## 🗄️ Database Schema

```prisma
model Job {
  id         String   @id @default(uuid())
  taskName   String
  payload    String   // JSON stored as string
  priority   String   // Low, Medium, High
  status     String   @default("pending") // pending, running, completed
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  webhookLog String?  // Webhook response/error log
}
```

### ER Diagram

```
┌─────────────────────────┐
│         Job             │
├─────────────────────────┤
│ id (PK)        String   │
│ taskName       String   │
│ payload        String   │
│ priority       String   │
│ status         String   │
│ createdAt      DateTime │
│ updatedAt      DateTime │
│ webhookLog     String?  │
└─────────────────────────┘
```

---

## 🔌 API Documentation

### Base URL
```
http://localhost:5000
```

### Endpoints

#### 1. **POST /jobs** - Create a new job
**Request Body:**
```json
{
  "taskName": "Send Email Report",
  "payload": "{\"email\": \"user@example.com\", \"subject\": \"Monthly Report\"}",
  "priority": "High"
}
```

**Response:**
```json
{
  "id": "uuid",
  "taskName": "Send Email Report",
  "payload": "{...}",
  "priority": "High",
  "status": "pending",
  "createdAt": "2026-02-03T10:00:00.000Z",
  "updatedAt": "2026-02-03T10:00:00.000Z"
}
```

---

#### 2. **GET /jobs** - List all jobs (with optional filters)
**Query Parameters:**
- `status` (optional): `pending`, `running`, `completed`
- `priority` (optional): `Low`, `Medium`, `High`

**Example:**
```
GET /jobs?status=completed&priority=High
```

**Response:**
```json
[
  {
    "id": "uuid",
    "taskName": "Send Email Report",
    "status": "completed",
    "priority": "High",
    ...
  }
]
```

---

#### 3. **GET /jobs/:id** - Get job details
**Response:**
```json
{
  "id": "uuid",
  "taskName": "Send Email Report",
  "payload": "{...}",
  "priority": "High",
  "status": "completed",
  "webhookLog": "Success: 200",
  ...
}
```

---

#### 4. **POST /run-job/:id** - Run a job
**Response:**
```json
{
  "message": "Job started successfully",
  "jobId": "uuid"
}
```

**Process:**
1. Status changes to `running`
2. Waits 3 seconds (simulates processing)
3. Status changes to `completed`
4. Triggers webhook to configured URL

---

#### 5. **POST /webhook-test** - Test webhook receiver (optional)
Logs incoming webhook payloads to console.

---

## 🔗 Webhook Integration

When a job completes, the system sends a POST request to the configured webhook URL.

### Webhook Payload
```json
{
  "jobId": "uuid",
  "taskName": "Send Email Report",
  "priority": "High",
  "payload": { "email": "user@example.com" },
  "completedAt": "2026-02-03T10:00:03.000Z"
}
```

### Configuration
Set the webhook URL in `backend/.env`:
```env
WEBHOOK_URL=https://webhook.site/your-unique-id
```

You can test webhooks using [webhook.site](https://webhook.site) - it provides a unique URL to inspect incoming requests.

---

## 🏗️ Architecture

### Flow Diagram

```
┌─────────────┐      ┌─────────────┐      ┌──────────────┐
│   User      │─────▶│  Next.js    │─────▶│   Express    │
│  (Browser)  │◀─────│  Frontend   │◀─────│   Backend    │
└─────────────┘      └─────────────┘      └──────┬───────┘
                                                  │
                                                  ▼
                                          ┌──────────────┐
                                          │   SQLite DB  │
                                          │   (Prisma)   │
                                          └──────────────┘
                                                  │
                                                  ▼
                                          ┌──────────────┐
                                          │   Webhook    │
                                          │   Endpoint   │
                                          └──────────────┘
```

### Key Design Decisions

1. **SQLite for Simplicity**: Easy setup, no external database required
2. **Prisma ORM**: Type-safe database access, automatic migrations
3. **Background Job Simulation**: Uses async IIFE to simulate non-blocking execution
4. **Real-time Polling**: Frontend polls every 2 seconds for job updates
5. **Dark Theme UI**: Modern, professional aesthetic with glassmorphism

---

## 📦 Setup Instructions

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### 1. Clone the Repository
```bash
git clone <repository-url>
cd dotix-job-scheduler
```

### 2. Backend Setup
```bash
cd backend
npm install
npx prisma migrate dev --name init
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Frontend will run on `http://localhost:3000`

### 4. Configure Webhook (Optional)
1. Visit [webhook.site](https://webhook.site)
2. Copy your unique URL
3. Update `backend/.env`:
   ```env
   WEBHOOK_URL=https://webhook.site/your-unique-id
   ```

---

## 🎯 Usage

1. **Create a Job**
   - Fill in task name, JSON payload, and priority
   - Click "Create Job"

2. **View Jobs**
   - All jobs appear in the dashboard
   - Use filters to narrow down by status/priority

3. **Run a Job**
   - Click "Run" button on any pending job
   - Watch status change: pending → running → completed

4. **View Details**
   - Click on any job card to see full details
   - Check webhook logs after completion

---

## 🤖 AI Usage Disclosure

### AI Tools Used
- **Tool**: Google Gemini 2.0 Flash (via Antigravity IDE)
- **Model**: Gemini 2.0 Flash Thinking Experimental

### What AI Helped With

1. **Project Architecture**
   - Designed the full-stack structure
   - Chose appropriate tech stack (Next.js, Express, Prisma, SQLite)
   - Planned API endpoints and database schema

2. **Backend Development**
   - Generated Express server with TypeScript
   - Implemented all 5 API endpoints
   - Created Prisma schema and migrations
   - Implemented async job processing logic
   - Integrated webhook trigger functionality

3. **Frontend Development**
   - Built Next.js dashboard with App Router
   - Designed modern UI with Tailwind CSS
   - Implemented real-time job polling
   - Created filtering and detail view features
   - Added glassmorphism and animations

4. **Documentation**
   - Generated comprehensive README
   - Created API documentation
   - Designed architecture diagrams
   - Wrote setup instructions

### Prompts Used

**Initial Prompt:**
```
Complete the full-stack developer skill test for Dotix Technologies. 
Build a Job Scheduler & Automation System with:
- Frontend: Next.js with Tailwind
- Backend: Node.js/Express with TypeScript
- Database: SQLite with Prisma
- Features: Create jobs, run jobs, track status, webhook integration
Follow all requirements from the assignment document.
```

**Follow-up Prompt:**
```
Speed up the development process. Create all files directly without 
interactive prompts. Use a modern dark theme UI with premium design.
```

### AI Contribution Breakdown
- **Code Generation**: 95%
- **Architecture Design**: 90%
- **UI/UX Design**: 100%
- **Documentation**: 100%
- **Debugging**: 80%

**Human Contribution**: Project requirements interpretation, testing, final review

---

## 🚀 Deployment (Optional)

### Backend (Railway/Render)
1. Push code to GitHub
2. Connect repository to Railway/Render
3. Set environment variables
4. Deploy

### Frontend (Vercel)
1. Push code to GitHub
2. Import project in Vercel
3. Set `NEXT_PUBLIC_API_URL` to deployed backend URL
4. Deploy

---

## 📝 License

MIT License - Free to use for educational and commercial purposes.

---

## 👨‍💻 Developer

**Candidate**: Fresher Full Stack Developer  
**Test**: Dotix Technologies Skill Assessment  
**Date**: February 2026  
**AI-Assisted**: Yes (Google Gemini 2.0 Flash)

---

## 🙏 Acknowledgments

- Dotix Technologies for the assignment
- Next.js team for the amazing framework
- Prisma team for the excellent ORM
- Tailwind CSS for the utility-first styling
- Google Gemini for AI assistance
