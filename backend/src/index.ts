
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/environment.js";
import { apiRoutes } from "./routes/index.js";

// Initialize express app
const app = express();

// Apply middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use(env.apiPrefix, apiRoutes);

// Health check endpoint
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "finance-assistant-backend",
  });
});

// Fallback for undefined routes
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    message: "Not Found - The requested resource does not exist",
  });
});

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(`Error: ${err.message}`);
  res.status(500).json({
    message: "Internal Server Error",
    error: env.isDevelopment ? err.message : undefined,
  });
});

// Start the server
const server = app.listen(env.port, () => {
  console.log(`Server running in ${env.nodeEnv} mode at http://localhost:${env.port}`);
  console.log(`API available at http://localhost:${env.port}${env.apiPrefix}`);
  console.log(`Health check at http://localhost:${env.port}/health`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => console.log("HTTP server closed"));
});

export { app };
