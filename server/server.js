import './config/instrument.js'
import * as Sentry from "@sentry/node";
import express from "express";
import cors from "cors"
import 'dotenv/config'
import connectDB from "./config/db.js";
import companyRoutes from './routes/companyRoutes.js';
import jobRoutes from "./routes/jobRoutes.js"
import userRoutes from "./routes/userRoute.js"
import adminRoutes from "./routes/adminRoutes.js"
import connectCloudinary from './config/cloudinary.js';

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

//Routes

app.get("/", function (req, res) {
  res.send("Api is Working")
})
app.get("/favicon.ico", (req, res) => res.status(204).end());
app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

app.use('/api/company', companyRoutes)
app.use('/api/admin', adminRoutes)
app.use("/api/jobs", jobRoutes)
app.use("/api/users", userRoutes)
//Port

const PORT = process.env.PORT || 5000
Sentry.setupExpressErrorHandler(app);

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log("Server is running at port ", PORT)
  })
}

export default app;



