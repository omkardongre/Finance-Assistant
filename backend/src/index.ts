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

// Async handler wrapper for error handling and correct typing
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

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
app.get("/api/expenses", authenticateToken, asyncHandler(async (req: Request, res: Response) => {
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
}));

// Signup Route
app.post("/signup", asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }
  try {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    res.status(201).json({ message: "User created", user: data.user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}));

// Expense Logging Route
app.post("/api/expenses", authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const { amount, category, date, description } = req.body;
  const user_id = (req as any).user.sub;
  if (!amount || !category || !date) {
    res.status(400).json({ error: "Required fields missing" });
    return;
  }
  if (amount <= 0) {
    res.status(400).json({ error: "Amount must be positive" });
    return;
  }
  try {
    const { data, error } = await supabase
      .from("expenses")
      .insert([{ amount, category, date, description, user_id }]);
    if (error) throw error;
    res.status(201).json({ message: "Expense saved", data });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
