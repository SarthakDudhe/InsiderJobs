import './config/instrument.js'
import * as Sentry from "@sentry/node";
import express from "express";
import cors from "cors"
import 'dotenv/config'
import connectDB from "./config/db.js";
import { clerkWebHooks } from './controllers/webhooks.js';
import companyRoutes from './routes/companyRoutes.js';
import jobRoutes from "./routes/jobRoutes.js"
import userRoutes from "./routes/userRoute.js"
import adminRoutes from "./routes/adminRoutes.js"
import connectCloudinary from './config/cloudinary.js';
import { clerkMiddleware } from '@clerk/express'
//initialize Express
const app = express()

// connect to database
connectDB()
connectCloudinary()



//Middlewares

app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token']
}))
app.use(express.json())

// Conditional Clerk middleware to prevent crashes on routes that do not need Clerk authentication
let userClerkMiddleware;
if (process.env.CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY) {
  userClerkMiddleware = clerkMiddleware();
} else {
  console.warn("WARNING: Clerk credentials (CLERK_PUBLISHABLE_KEY or CLERK_SECRET_KEY) are missing in environment variables. User authentication routes will return an error.");
  userClerkMiddleware = (req, res, next) => {
    res.status(500).json({
      success: false,
      message: "Clerk credentials are not configured on the server. Please add CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY to your environment variables."
    });
  };
}


//Routes

app.get("/", function (req, res) {
  res.send("Api is Working")
})
app.get("/favicon.ico", (req, res) => res.status(204).end());
app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

app.post("/webhooks", clerkWebHooks)
app.use('/api/company', companyRoutes)
app.use('/api/admin', adminRoutes)
app.use("/api/jobs", jobRoutes)
app.use("/api/users", userClerkMiddleware, userRoutes)
//Port

const PORT = process.env.PORT || 5000
Sentry.setupExpressErrorHandler(app);

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log("Server is running at port ", PORT)
  })
}

export default app;



