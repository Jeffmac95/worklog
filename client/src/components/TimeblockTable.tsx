import { useState, useEffect } from "react";
import api from "../api/axios";

interface Timeblock {
    id: number;
    userId: number;
    activity: string;
    timeSpent: number;
    createdAt: string;
}

export default function TimeblockTable() {
    const [timeblocks, setTimeblocks] = useState<Timeblock[]>([]);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");
    const [editId, setEditId] = useState<number | null>(null);
    const [editActivity, setEditActivity] = useState("");
    const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);


    async function fetchTimeblocks(searchTerm?: string) {
        try {
            const url = searchTerm ? `/timeblocks?search=${encodeURIComponent(searchTerm)}` : "/timeblocks";
            const response = await api.get(url);
            setTimeblocks(response.data);
            setError("");
        } catch (err: any) {
            setError(err.response?.data?.error || "Error fetching timeblocks.");
        }
    }

    useEffect(() => {
        fetchTimeblocks();
    }, []);



    async function deleteTimeblock(id: number) {
        try {
            await api.delete(`/timeblocks/${id}`);
            setTimeblocks((prev) => prev.filter((t) => t.id != id));
            setDeleteConfirmId(null);
            setError("");
        } catch (err: any) {
            setError(err.response?.data?.error || "Error deleting timeblock.");
        }
    }

    async function updateTimeblock(id: number) {
        if (!editActivity.trim()) {
            setError("Activity cannot be empty.");
            return;
        }

        try {
            const response = await api.put(`/timeblocks/${id}`, { activity: editActivity });
            setTimeblocks((prev) =>
                prev.map((t) => (t.id === id ? { ...t, activity: response.data.activity } : t))
            );
            setEditId(null);
            setEditActivity("");
            setError("");
        } catch (err: any) {
            setError(err.response?.data?.error || "Error updating timeblock.");
        }
    }

    function formatTime(seconds: number) {
        const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
        const s = (seconds % 60).toString().padStart(2, "0");
        return `${h}:${m}:${s}`;
    }

    function formatDate(dateStr: string) {
        return new Date(dateStr).toLocaleDateString("en-CA", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    }

        return (
        <div className="bg-[#16181f] border border-[#2a2d38] rounded-2xl p-6">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-[#9ca3af] text-xs font-medium uppercase tracking-wider">
                    Timeblocks
                </h2>
                <span className="text-[#3d4150] text-xs font-mono">
                    {timeblocks.length} entries
                </span>
            </div>

            {/* Search */}
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && fetchTimeblocks(search)}
                    placeholder="Search activity..."
                    className="flex-1 bg-[#0f1117] border border-[#2a2d38] text-white rounded-lg px-4 py-2.5 text-sm placeholder-[#3d4150] focus:outline-none focus:border-[#e2a84b] transition-colors duration-200"
                />
                <button
                    onClick={() => fetchTimeblocks(search)}
                    className="px-4 py-2.5 bg-[#2a2d38] text-white rounded-lg text-sm hover:bg-[#353849] transition-colors duration-200"
                >
                    Search
                </button>
                <button
                    onClick={() => { setSearch(""); fetchTimeblocks(); }}
                    className="px-4 py-2.5 bg-[#2a2d38] text-[#6b7280] rounded-lg text-sm hover:bg-[#353849] hover:text-white transition-colors duration-200"
                >
                    All
                </button>
            </div>

            {/* Error */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5 mb-4">
                    <p className="text-red-400 text-sm">{error}</p>
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-[#2a2d38]">
                            <th className="text-left text-[#6b7280] text-xs font-medium uppercase tracking-wider pb-3 pr-4">Activity</th>
                            <th className="text-left text-[#6b7280] text-xs font-medium uppercase tracking-wider pb-3 pr-4">Time Spent</th>
                            <th className="text-left text-[#6b7280] text-xs font-medium uppercase tracking-wider pb-3 pr-4">Date</th>
                            <th className="text-left text-[#6b7280] text-xs font-medium uppercase tracking-wider pb-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {timeblocks.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="text-center text-[#3d4150] text-sm py-8">
                                    No timeblocks yet. Start the timer to log one!
                                </td>
                            </tr>
                        ) : (
                            timeblocks.map((t) => (
                                <>
                                    <tr key={t.id} className="border-b border-[#2a2d38]/50 hover:bg-[#0f1117]/50 transition-colors duration-150">
                                        <td className="py-3 pr-4">
                                            {editId === t.id ? (
                                                <input
                                                    type="text"
                                                    value={editActivity}
                                                    onChange={(e) => setEditActivity(e.target.value)}
                                                    onKeyDown={(e) => e.key === "Enter" && updateTimeblock(t.id)}
                                                    className="bg-[#0f1117] border border-[#e2a84b] text-white rounded-lg px-3 py-1.5 text-sm focus:outline-none w-full"
                                                    autoFocus
                                                />
                                            ) : (
                                                <span className="text-white text-sm">{t.activity}</span>
                                            )}
                                        </td>
                                        <td className="py-3 pr-4">
                                            <span className="text-[#e2a84b] font-mono text-sm">{formatTime(t.timeSpent)}</span>
                                        </td>
                                        <td className="py-3 pr-4">
                                            <span className="text-[#6b7280] text-sm">{formatDate(t.createdAt)}</span>
                                        </td>
                                        <td className="py-3">
                                            <div className="flex items-center gap-3">
                                                {editId === t.id ? (
                                                    <>
                                                        <button
                                                            onClick={() => updateTimeblock(t.id)}
                                                            className="text-[#e2a84b] text-xs hover:underline"
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            onClick={() => { setEditId(null); setEditActivity(""); }}
                                                            className="text-[#6b7280] text-xs hover:text-white"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => { setEditId(t.id); setEditActivity(t.activity); }}
                                                            className="text-[#6b7280] text-xs hover:text-white transition-colors duration-150"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => setDeleteConfirmId(t.id)}
                                                            className="text-[#6b7280] text-xs hover:text-red-400 transition-colors duration-150"
                                                        >
                                                            Delete
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                    {deleteConfirmId === t.id && (
                                        <tr key={`confirm-${t.id}`} className="bg-red-500/5">
                                            <td colSpan={4} className="py-2.5 px-3">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-red-400 text-xs">Delete this timeblock?</span>
                                                    <button
                                                        onClick={() => deleteTimeblock(t.id)}
                                                        className="text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 px-3 py-1 rounded-md transition-colors duration-150"
                                                    >
                                                        Confirm
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteConfirmId(null)}
                                                        className="text-xs text-[#6b7280] hover:text-white transition-colors duration-150"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}