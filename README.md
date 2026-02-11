# 💼 InsiderJobs - Modern Job Portal Platform

InsiderJobs is a comprehensive, full-stack job portal application designed to bridge the gap between talented job seekers and recruiters. Built with a focus on premium aesthetics and seamless user experience, it features a robust recruiter dashboard, real-time application tracking, and secure authentication.

---

## 🚀 Features

### **For Candidates**
- **Smart Job Search**: Filter jobs by category, location, and title.
- **Seamless Application**: Apply to jobs with a single click using stored resumes.
- **Application Tracking**: Real-time status updates (Pending, Accepted, Rejected).
- **Profile Management**: Upload and update resumes securely via Cloudinary.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop.

### **For Recruiters**
- **Recruiter Dashboard**: Manage all job postings in one centralized hub.
- **Job Management**: Post new jobs with rich-text descriptions (Quill.js) or toggle visibility.
- **Applicant Tracking System (ATS)**: Review candidate details, download resumes, and update application statuses.
- **Secure Auth**: Dedicated recruiter login and registration system.

---

## 🛠️ Tech Stack

### **Frontend**
- **React.js & Vite**: For a lightning-fast development experience.
- **Tailwind CSS**: Modern, utility-first styling for a premium UI.
- **Clerk Auth**: Secure and scalable user authentication.
- **Axios**: Promised-based HTTP client for API interaction.
- **React-Router-Dom**: Declarative routing for React applications.
- **React-Toastify**: Elegant notification system.

### **Backend**
- **Node.js & Express**: Scalable and performant server environment.
- **MongoDB & Mongoose**: Flexible NoSQL database for structured data.
- **Cloudinary**: Cloud storage for candidate resumes and company logos.
- **@clerk/express**: Backend integration for Clerk authentication.
- **Bcrypt & JWT**: Secure password hashing and recruiter token management.

---

## ⚙️ Installation & Setup

### **Prerequisites**
- Node.js (v16+)
- MongoDB Atlas account
- Clerk Dashboard account
- Cloudinary account

### **1. Clone the Repository**
```bash
git clone https://github.com/SarthakDudhe/InsiderJobs.git
cd InsiderJobs
```

### **2. Setup Backend**
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
Start the server:
```bash
npm run dev
```

### **3. Setup Frontend**
```bash
cd ../client
npm install
```
Create a `.env` file in the `client` directory:
```env
VITE_BACKEND_URL=http://localhost:5000
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```
Start the frontend:
```bash
npm run dev
```

---

## 📁 Project Structure

```text
InsiderJobs/
├── client/                # React Frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── Pages/         # Main page views
│   │   ├── context/       # AppContext for state management
│   │   └── assets/        # Static images and icons
├── server/                # Node.js Backend
│   ├── controllers/       # API logic
│   ├── models/            # Mongoose schemas
│   ├── routes/            # Express routes
│   └── config/            # Database and Cloudinary config
└── README.md
```

---

## 🤝 Contributing

Contributions are welcome! If you have suggestions for micro-functionalities or bug fixes, feel free to fork the repo and submit a PR.

---

## 📄 License

This project is licensed under the MIT License.

---

**Developed with ❤️ by Sarthak Dudhe**
