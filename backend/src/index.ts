import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Supabase Client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// JWT Auth Middleware
function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "Missing token" });
    return;
  }

  jwt.verify(
    token,
    process.env.SUPABASE_JWT_SECRET!,
    (err, user) => {
      if (err) {
        res.status(403).json({ error: "Invalid token" });
        return;
      }
      // Attach user payload to request
      (req as any).user = user;
      next();
    }
  );
}

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, Express + TypeScript!");
});

// Example protected route
app.get("/api/protected", authenticateToken, (req: Request, res: Response) => {
  res.json({ message: "This is a protected route!", user: (req as any).user });
});

// Example: Get all expenses for the logged-in user
app.get("/api/expenses", authenticateToken, async (req: Request, res: Response) => {
  const userId = (req as any).user.sub; // Supabase JWT uses 'sub' for user id
  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("user_id", userId);
  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.json(data);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
