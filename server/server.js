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
import connectCloudinary from './config/cloudinary.js';
import { clerkMiddleware } from '@clerk/express'
//initialize Express
const app = express()

// connect to database
connectDB()
connectCloudinary()



//Middlewares

app.use(cors())
app.use(express.json())
app.use(clerkMiddleware())


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
app.use("/api/jobs", jobRoutes)
app.use("/api/users", userRoutes)
//Port

const PORT = process.env.PORT || 5000
Sentry.setupExpressErrorHandler(app);

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log("Server is running at port ", PORT)
  })
}

export default app;



