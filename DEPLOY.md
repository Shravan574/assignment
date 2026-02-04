# How to Deploy

I have configured your project for deployment on **Vercel** (Frontend) and **Render** (Backend).

## 1. Backend Deployment (Render)
The backend is configured to use **PostgreSQL**. The `render.yaml` file included in the root directory will automatically provision a database and a web service for you.

1.  Push your code to GitHub.
2.  Go to [Render Dashboard](https://dashboard.render.com/).
3.  Click "New +" -> "Blueprint".
4.  Connect your GitHub repository.
5.  Render will detect the `render.yaml` and prompt you to apply it.
6.  Click **Apply**.
    *   This will create a `dotix-job-scheduler-backend` service and a `dotix-db` database.
    *   Wait for the deployment to finish.
7.  Copy the URL of the deployed backend service (e.g., `https://dotix-job-scheduler-backend.onrender.com`).

## 2. Frontend Deployment (Vercel)
1.  Go to [Vercel Dashboard](https://vercel.com/new).
2.  Import your GitHub repository.
3.  Configure the Project:
    *   **Root Directory**: Click "Edit" and select `frontend`.
    *   **Environment Variables**: Add the following:
        *   `NEXT_PUBLIC_API_URL`: Paste the Render Backend URL from Step 1 (e.g., `https://dotix-job-scheduler-backend.onrender.com`).
4.  Click **Deploy**.

## IMPORTANT NOTE FOR LOCAL DEVELOPMENT
I have changed the database provider in `backend/prisma/schema.prisma` from `sqlite` to `postgresql` to support deployment.
*   **If you want to run locally again**: You will need to change `provider = "postgresql"` back to `provider = "sqlite"` in `backend/prisma/schema.prisma` unless you have a local Postgres instance.

## One-Click Scripts
If you have the CLIs installed:
-   **Vercel**: Run `cd frontend && npx vercel`
