import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

const router = express.Router();
const SALT_ROUNDS = 10;

router.post("/register", async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ error: "Email and password are required." });
        return;
    }

    try {
        const existing = await db.select().from(users).where(eq(users.email, email));

        if (existing.length > 0) {
            res.status(400).json({ error: "Email already in use."});
            return;
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const newUser = await db.insert(users).values({
            email, password: hashedPassword
        })
        .returning({ id: users.id, email: users.email });

        const token = jwt.sign(
            { userId: newUser[0].id },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" }
        );

        res.status(200).json({ token, user: newUser[0] });
    } catch (err) {
        console.error("Register error:", err);
        res.status(500).json({ error: "Internal server error."});
    }
});

router.post("/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ message: "Email and password are required." });
        return;
    }

    try {
        const result = await db.select().from(users).where(eq(users.email, email));

        if (result.length === 0) {
            res.status(401).json({ error: "Invalid credentials." });
            return;
        }

        const user = result[0];

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            res.status(401).json({ error: "Invalid credentials." });
            return;
        }

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" }
        );

        res.status(200).json({ token, user: {id: user.id, email: user.email} });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Internal server error." });
    }
});


export default router;