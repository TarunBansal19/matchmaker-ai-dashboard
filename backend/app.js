import express from 'express';
import cors from 'cors';
import { prisma } from './src/config/client.js';

import customerRoutes from "./src/routes/customer.routes.js";
import noteRoutes from "./src/routes/note.routes.js";
import matchRoutes from "./src/routes/match.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import dashboardRoutes from "./src/routes/dashboard.routes.js";

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true  //allow cookies to be sent in cross-origin requests
}));

app.use(express.json());

app.get('/health', (req, res) => {
    res.status(200).json({ message: "Server is healthy" });
})

app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/dashboard", dashboardRoutes);

export default app;