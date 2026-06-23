<div align="center">
  <!-- BANNER PLACEHOLDER -->
  <img src="https://via.placeholder.com/1200x300/0f172a/3b82f6?text=[Animated+Hero+Banner+Here]+Recommended:+1200x300px" alt="InsiderJobs Banner" width="100%" />

  <br />
  <br />

  <!-- LOGO PLACEHOLDER -->
  <img src="https://via.placeholder.com/150x150/ffffff/0f172a?text=[Logo]" alt="InsiderJobs Logo" width="120" height="120" />

  <h1 align="center">InsiderJobs</h1>
  <p align="center"><strong>Next-Generation AI-Powered Recruitment & Career Command Center</strong></p>

  <p align="center">
    A premium Applicant Tracking System (ATS) and Job Board built with React, Node.js, and Groq LLMs. Bridging the gap between top talent and leading companies through intelligent AI matching, automated resume parsing, and seamless hiring pipelines.
  </p>

  <!-- BADGES -->
  <p align="center">
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
    <img src="https://img.shields.io/badge/AI_Powered-Groq-f59e0b?style=for-the-badge" alt="AI Powered" />
  </p>

  <p align="center">
    <!-- STATS PLACEHOLDERS -->
    <img src="https://img.shields.io/github/stars/SarthakDudhe/InsiderJobs?style=flat-square&color=blue" alt="Stars Placeholder" />
    <img src="https://img.shields.io/github/forks/SarthakDudhe/InsiderJobs?style=flat-square&color=blue" alt="Forks Placeholder" />
    <img src="https://img.shields.io/badge/Deployment-Live-success?style=flat-square" alt="Deployment Status Placeholder" />
    <img src="https://img.shields.io/github/license/SarthakDudhe/InsiderJobs?style=flat-square&color=blue" alt="License Placeholder" />
    <img src="https://img.shields.io/badge/Version-1.0.0-blue?style=flat-square" alt="Version" />
  </p>
  
  <p align="center">
    <!-- SOCIAL LINKS PLACEHOLDERS -->
    <a href="[Live Demo URL]"><img src="https://img.shields.io/badge/Live%20Demo-Launch-success?style=for-the-badge" alt="Live Demo" /></a>
    <a href="[LinkedIn URL]"><img src="https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin" alt="LinkedIn" /></a>
    <a href="[Portfolio URL]"><img src="https://img.shields.io/badge/Portfolio-View-8b5cf6?style=for-the-badge&logo=globe" alt="Portfolio" /></a>
  </p>
</div>

---

## ⚡ Key Achievements & Engineering Highlights

For Technical Recruiters and Engineering Managers reviewing this project, here are the most significant technical achievements:

> [!TIP]
> **Why this project stands out:** This is not a standard CRUD application. It incorporates complex AI orchestration, real-time data handling, and robust multi-tenant architectures.

- **Intelligent AI Orchestration (Groq API + LLaMA 3 70B):** Implemented a high-performance backend pipeline that parses raw PDF resumes via `unpdf`, extracts structured text, and feeds it to Groq LLMs. The AI automatically generates an ATS match score, extracts skills/experience/education, outputs tailored interview questions for recruiters, and provides personalized resume tailoring suggestions.
- **Multi-Tenant Architecture & Role-Based Access Control (RBAC):** Custom JWT-based authentication system securely isolating three distinct domains: Candidates, Recruiters (Companies), and Admins. Includes company verification workflows.
- **Real-Time Polling & Optimistic UI Updates:** Built highly responsive recruiter dashboards that auto-refresh every 30 seconds to fetch new applicants without memory leaks, paired with optimistic state updates for instant AI screening results.
- **Enterprise-Grade UI/UX:** Designed a completely custom, Tailwind-based design system featuring glassmorphism, fluid micro-animations, conic-gradient data visualizations, and robust responsive layouts. No pre-built component libraries (like MUI/Chakra) were relied upon for core layouts.
- **Complex Aggregation & Analytics:** Frontend analytics engine that calculates funnel conversion rates, time-to-decision metrics, and identifies "stale" applications on the fly.

---

## 🚀 Feature Showcase

### 🧠 AI-Powered Candidate Features
| Feature | Description | Technical Implementation |
|---------|-------------|--------------------------|
| **Smart PDF Resume Parsing** | Upload a PDF resume and watch the AI instantly extract your skills, education, and experience into a structured profile. | `unpdf` buffer parsing → Groq LLM JSON schema enforcement. |
| **ATS Job Audit** | Compares candidate's resume text against job descriptions to provide a match score, missing keywords, and tailoring tips. | Server-side prompt engineering with LLaMA 3 returning strictly typed JSON. |
| **AI Job Recommender** | Suggests the best active job listings based on the semantic match of the candidate's parsed profile. | Dynamic querying and filtering algorithms based on AI-extracted tags. |
| **Career Command Center** | A visual pipeline showing pending, accepted, and rejected applications with success rate visualizations. | Custom SVG Conic Gradients, local data aggregation, and memoized math. |

### 🏢 Enterprise Recruiter Console
| Feature | Description | Technical Implementation |
|---------|-------------|--------------------------|
| **AI Candidate Pre-Screening** | Recruiters can click a button to have the AI instantly summarize an applicant's fit, score them (0-100), and generate 3 custom interview questions. | Asynchronous `Groq SDK` API calls with MongoDB document updates. |
| **Pipeline Management** | Track applicants through a visual table, mark them as Accepted/Rejected, and manage active/hidden job postings. | React state management with auto-refresh (`setInterval`) hooks and Axios interceptors. |
| **Rich Text Job Editor** | Create compelling job descriptions using a fully integrated rich text editor. | Integrated `Quill.js` mapped to MongoDB string schemas. |
| **Workspace Verification** | Companies cannot post active jobs until their workspace email is verified and approved by the platform Admin. | Secure backend flags (`isEmailVerified`, `isVerified`) checked via middleware. |

<br />

<div align="center">
  <!-- DASHBOARD PREVIEW PLACEHOLDER -->
  <img src="https://via.placeholder.com/1000x500/f8fafc/0f172a?text=[Dashboard+Preview+Screenshot]+Recommended:+1000x500px" alt="Recruiter Dashboard Preview" width="100%" />
  <p><em>Recruiter Pipeline Dashboard showing Candidate Social Links, Resumes, and Application Statuses</em></p>
</div>

---

## 🗺️ Interactive Product Walkthrough

### The User Journey

```mermaid
journey
    title Candidate User Flow
    section Onboarding
      Sign up with Email: 5: Candidate
      Upload PDF Resume: 4: Candidate
      AI Extracts Profile: 5: System
    section Discovery
      Browse Job Listings: 4: Candidate
      Run ATS Audit on Job: 5: Candidate
      AI Suggests Resume Tweaks: 4: System
    section Application
      Apply to Job: 5: Candidate
      Recruiter Receives App: 5: Recruiter
      AI Auto-Screens Candidate: 5: System
```

### Authentication Flow
```mermaid
sequenceDiagram
    participant Client
    participant Server
    participant DB
    Client->>Server: POST /api/users/login (email, pass)
    Server->>DB: Find User
    DB-->>Server: Return User Doc
    Server->>Server: bcrypt.compare(pass, hash)
    Server->>Server: jwt.sign(id, secret)
    Server-->>Client: 200 OK + token
    Client->>Client: localStorage.setItem('userToken', token)
    Client->>Client: React Context State Update
```

---

## 🛠️ Technology Ecosystem

### Frontend
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

### Backend & Database
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-800?style=for-the-badge&logo=mongoose&logoColor=white)

### AI & Cloud Integrations
![Groq](https://img.shields.io/badge/Groq_LLM-f59e0b?style=for-the-badge)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)
![JWT](https://img.shields.io/badge/JSON_Web_Tokens-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)

---

## 🏗️ Architecture & Database Design

### System Design
The application follows a decoupled Client-Server architecture. The React/Vite frontend communicates securely with the Express.js REST API. Static assets and resumes are streamed directly to Cloudinary.

### Database Relational Schema

```mermaid
erDiagram
    USER ||--o{ JOB_APPLICATION : submits
    COMPANY ||--o{ JOB : posts
    COMPANY ||--o{ JOB_APPLICATION : receives
    JOB ||--o{ JOB_APPLICATION : has

    USER {
        ObjectId _id
        String name
        String email
        String password
        String resumeText
        Array skills
        Object links
    }
    COMPANY {
        ObjectId _id
        String name
        String email
        Boolean isVerified
    }
    JOB {
        ObjectId _id
        ObjectId companyId
        String title
        String description
    }
    JOB_APPLICATION {
        ObjectId _id
        ObjectId userId
        ObjectId jobId
        ObjectId companyId
        String status
        Number aiScore
        String aiSummary
    }
```

---

## 💻 Installation & Local Development

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB Cluster (Local or Atlas)
- Groq API Key (for AI features)
- Cloudinary Account (for file storage)

### Step 1: Clone the repository
```bash
git clone https://github.com/SarthakDudhe/InsiderJobs.git
cd InsiderJobs
```

### Step 2: Setup Backend
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory:
```env
MONGODB_URI=your_mongodb_connection_string
GROK_API_KEY=your_groq_api_key
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret
CLOUDINARY_NAME=your_cloudinary_name
JWT_SECRET=your_super_secret_key
PORT=5000
```
Start the backend server:
```bash
npm run dev
```

### Step 3: Setup Frontend (Client)
```bash
cd ../client
npm install
```
Create a `.env` file in the `client` directory:
```env
VITE_BACKEND_URL=http://localhost:5000
```
Start the Vite development server:
```bash
npm run dev
```

### Step 4: Setup Admin Dashboard
```bash
cd ../admin
npm install
npm run dev
```

---

## 🔒 Security Considerations

- **Authentication:** Custom JWT-based stateless authentication with secure storage and strict expiration limits. Frontend robustly clears local storage if malformed/expired tokens are detected.
- **File Uploads:** Validated via `multer` before uploading to Cloudinary. Temporary local files are immediately unlinked (deleted) from the server filesystem via `fs.unlink` to prevent directory traversal and storage exhaustion.
- **Passwords:** Hashed with a 10-round salt using `bcryptjs` before persisting to MongoDB.
- **API Guarding:** Dedicated Middlewares (`protectUser`, `protectCompany`, `protectAdmin`) enforce role-based access control.

---

<div align="center">
  <h2>Ready to revolutionize recruitment?</h2>
  <p>Contributions, issues, and feature requests are welcome!</p>
  <p>Feel free to check <a href="#">issues page</a>.</p>
  
  <br />
  <img src="https://via.placeholder.com/600x150/ffffff/0f172a?text=[Footer+Banner+Placeholder]+Recommended:+600x150px" alt="Footer Banner" width="600" />
</div>

<p align="center">Made with ❤️ by <a href="https://github.com/SarthakDudhe">Sarthak Dudhe</a></p>
