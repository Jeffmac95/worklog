import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import timeblockRoutes from "./routes/timeblocks";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT"]
}));

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/timeblocks", timeblockRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})