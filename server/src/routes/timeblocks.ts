import express, { Response } from "express";
import { db } from "../db";
import { timeblocks } from "../db/schema";
import { eq, and, like } from "drizzle-orm";
import { verifyToken, AuthRequest } from "../middleware/auth";

const router = express.Router();

router.use(verifyToken);

router.get("/", async (req: AuthRequest, res: Response) => {
    const { search } = req.query;

    try {
        let result;

        if (search) {
            result = await db
            .select()
            .from(timeblocks)
            .where(and(
                eq(timeblocks.userId, req.userId!),
                like(timeblocks.activity, `%${search}%`)    
                )
            );
        } else {
            result = await db
            .select()
            .from(timeblocks)
            .where(eq(timeblocks.userId, req.userId!));
        }

        res.status(200).json(result);
    } catch (err) {
        console.error("Get timeblocks error:", err);
        res.status(500).json({ error: "Internal server error." });
    }
});

router.post("/", async (req: AuthRequest, res: Response) => {
    const { activity, timeSpent } = req.body;

    if (!activity || activity.trim() === "") {
        res.status(400).json({ error: "Activity is required."});
        return;
    }

    if (!timeSpent || timeSpent <= 0) {
        res.status(400).json({ error: "Time spent must be greater than zero." });
        return;
    }

    try {
        const newTimeblock = await db
        .insert(timeblocks)
        .values({
            userId: req.userId!,
            activity: activity.toLowerCase().trim(),
            timeSpent
        })
        .returning();

        res.status(200).json(newTimeblock[0]);
    } catch (err) {
        console.error("Post timeblock error:", err);
        res.status(500).json({ error: "Internal server error." });
    }
});

router.delete("/:id", async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id as string);

    try {
        const deleted = await db
        .delete(timeblocks)
        .where(
            and(
                eq(timeblocks.id, id),
                eq(timeblocks.userId, req.userId!)
            )
        )
        .returning();

        if (deleted.length === 0) {
            res.status(404).json({ error: "Timeblock not found." });
            return;
        }

        res.status(200).json({ deletedId: id });
    } catch (err) {
        console.error("Delete timeblock error:", err);
        res.status(500).json({ error: "Internal server error." });
    }
});

router.put("/:id", async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id as string);
    const { activity } = req.body;

    if (!activity || activity.trim() === "") {
        res.status(400).json({ error: "Activity is required." });
        return;
    }

    try {
        const updated = await db
        .update(timeblocks)
        .set({ activity: activity.toLowerCase().trim() })
        .where(
            and(
                eq(timeblocks.id, id),
                eq(timeblocks.userId, req.userId!)
            )
        )
        .returning();

        if (updated.length === 0) {
            res.status(404).json({ error: "Timeblock not found." });
            return;
        }

        res.status(200).json(updated[0]);
    } catch (err) {
        console.error("Update timeblock error:", err);
        res.status(500).json({ error: "Internal server error." });
    }
});


export default router;