# 🧠 Candidate-Employer Match Platform – Backend

The **backend API** for a resume/job matching platform, built with **Node.js**, **Express**, and **PostgreSQL**.

---

## 🛠 Tech Stack

- **Node.js** + **Express**
- **TypeScript**
- **PostgreSQL** with **Prisma ORM**
- **OpenAI API** for embedding generation
- **pdf-parse** for reading resumes
- **JWT** for authentication
- **Multer** for file uploads
- Deployed on **Render** : https://hackathon-backend-1-hf8v.onrender.com/

---

### 👤 Candidate

- Register/Login
- Upload resume (PDF)
- Resume text : extracted and stored
- Resume embedding using OpenAI
- Matched to jobs

### 🏢 Employer

- Register/Login
- Post job
- Job text : embedded OpenAI
- Matched to candidates
- View matching candidates

---

## 🧠 How AI Matching Works

We use **OpenAI Embedding API** (`text-embedding-3-small`) to convert free-form text (resumes and job descriptions) into **vector embeddings** — high-dimensional arrays of numbers that capture semantic meaning.

### ⚙️ Steps:

1. **Resume Upload**:

   - PDF is parsed to plain text
   - Text is sent to OpenAI → embedding generated
   - Embedding stored in DB (`Profile.vector`)

2. **Job Posting**:

   - Title + description + requirements → concatenated
   - Sent to OpenAI → embedding generated
   - Compared against all stored resume embeddings

3. **Matching Logic**:
   - Uses **cosine similarity** to compare vectors
   - Top matches are stored in a `ResumeMatch` table
   - Results are shown instantly to both employer and candidate

### Example:

- Job: “MERN Stack Developer with MongoDB & React”
- Candidate 1: resume has MongoDB, React → high score
- Candidate 2: generic resume → lower score

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/your-backend-repo.git
cd your-backend-repo
```

```bash
npm install
```

Create a .env file:

```bash
PORT=5000
JWT_SECRET=your-secret
OPENAI_API_KEY=sk-...
DATABASE_URL=postgresql://user:password@host:port/dbname
```

Prisma setup:

```bash
npx prisma generate
npx prisma migrate deploy
```

Run the server:

```bash
npm run dev  # for development
npm run build && npm start  # for production
```

## API Endpoints

### Auth

POST /api/auth/register

POST /api/auth/login

### Candidate

POST /api/resume/upload → upload resume

GET /api/matches/candidate → view matched jobs

### Employer

POST /api/job → post a job

GET /api/job → list posted jobs

GET /api/matches/employer/:jobId → matched candidates
