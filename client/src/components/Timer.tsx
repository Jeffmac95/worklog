import { useState, useRef } from "react";
import api from "../api/axios";


interface TimerProps {
    onLog: () => void;
}

export default function Timer({ onLog }: TimerProps) {
    const [time, setTime] = useState(0);
    const [activity, setActivity] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    function start() {
        if (intervalRef.current !== null) return;
        setIsRunning(true);
        intervalRef.current = setInterval(() => {
            setTime((prev) => prev + 1);
        }, 1000);
    }

    function pause() {
        if (intervalRef.current === null) return;
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setIsRunning(false);
    }

    function reset() {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        setTime(0);
        setIsRunning(false);
        setError("");
        setSuccess("");
    }

    async function post() {
        if (activity.trim() === "") {
            setError("Enter an activity before logging.");
            return;
        }
        if (time <= 0) {
            setError("Time must be greater than zero.");
            return;
        }

        try {
            await api.post("/timeblocks", {
                activity,
                timeSpent: time
            });
            setSuccess("Timeblock logged!");
            setTime(0);
            setActivity("");
            setIsRunning(false);
            clearInterval(intervalRef.current!);
            intervalRef.current = null;
            setError("");
            onLog();
        } catch (err: any) {
            setError(err.response?.data?.error || "Error logoging timeblock.");
        }
    }

    function formatTime(seconds: number) {
        const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
        const s = (seconds % 60).toString().padStart(2, "0");
        return `${h}:${m}:${s}`;
    }

        return (
            <div className="bg-[#16181f] border border-[#2a2d38] rounded-2xl p-6">

                {/* Title */}
                <h2 className="text-[#9ca3af] text-xs font-medium uppercase tracking-wider mb-6">
                    Timer
                </h2>

                {/* Time display */}
                <div className="text-center mb-6">
                    <span className="text-5xl font-mono font-bold text-white tracking-tight">
                        {formatTime(time)}
                    </span>
                    <div className="mt-2 flex items-center justify-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${isRunning ? "bg-[#e2a84b]" : "bg-[#2a2d38]"}`} />
                        <span className="text-[#6b7280] text-xs">
                            {isRunning ? "Running" : time > 0 ? "Paused" : "Idle"}
                        </span>
                    </div>
                </div>

                {/* Activity input */}
                <div className="mb-4">
                    <input
                        type="text"
                        value={activity}
                        onChange={(e) => {
                            setActivity(e.target.value);
                            setError("");
                            setSuccess("");
                        }}
                        placeholder="What are you working on?"
                        className="w-full bg-[#0f1117] border border-[#2a2d38] text-white rounded-lg px-4 py-3 text-sm placeholder-[#3d4150] focus:outline-none focus:border-[#e2a84b] transition-colors duration-200"
                    />
                </div>

                {/* Buttons */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                    <button
                        onClick={start}
                        disabled={isRunning}
                        className="py-2.5 rounded-lg text-sm font-medium bg-[#e2a84b] text-[#0f1117] hover:bg-[#d4963a] transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Start
                    </button>
                    <button
                        onClick={pause}
                        disabled={!isRunning}
                        className="py-2.5 rounded-lg text-sm font-medium bg-[#2a2d38] text-white hover:bg-[#353849] transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Pause
                    </button>
                    <button
                        onClick={reset}
                        className="py-2.5 rounded-lg text-sm font-medium bg-[#2a2d38] text-white hover:bg-[#353849] transition-colors duration-200"
                    >
                        Reset
                    </button>
                    <button
                        onClick={post}
                        className="py-2.5 rounded-lg text-sm font-medium bg-[#e2a84b] text-[#0f1117] hover:bg-[#d4963a] transition-colors duration-200"
                    >
                        Log
                    </button>
                </div>

                {/* Messages */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5">
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}
                {success && (
                    <div className="bg-[#e2a84b]/10 border border-[#e2a84b]/20 rounded-lg px-4 py-2.5">
                        <p className="text-[#e2a84b] text-sm">{success}</p>
                    </div>
                )}
            </div>
        );
}