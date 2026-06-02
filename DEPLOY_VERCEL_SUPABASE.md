Vercel + Supabase deployment guide (concise)

1) Create a GitHub repo and push this project.

2) Supabase (managed Postgres)
   - Create a free Supabase account (no card normally required).
   - Create a new project and obtain `DATABASE_URL` (connection string).
   - In the SQL editor, run `database/postgres_schema.sql` to create tables.
   - Create an API/service role key if you need server-side migration tasks.
   - Password for project is "etty2026niy"

3) Vercel
   - Create a Vercel account and import the GitHub repo.
   - Set Environment Variables in Project Settings:
     - `DATABASE_URL` = Supabase connection string
     - `JWT_SECRET` = secure random string
     - Any other PG_* vars if you prefer them
   - Vercel will detect `api/` and deploy serverless functions at `/api/*`.

4) Local testing
   - Install deps in `backend/` if you run the Express server locally.
     ```bash
     cd backend
     npm install
     node server.js
     ```

5) Notes
   - Do not commit secrets — use Vercel env vars.
   - For end-to-end security, use HTTPS (Vercel provides it) and enable Row Level Security in Supabase if needed.
