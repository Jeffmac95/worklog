import { useRef } from "react";
import Navbar from "../components/Navbar";
import Timer from "../components/Timer";
import TimeblockTable from "../components/TimeblockTable";


export default function Dashboard() {
    const refreshTableRef = useRef<() => void>(null);

    return (
        <div className="min-h-screen bg-[#0f1117]">
            <Navbar />
            <main className="max-w-6xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 items-start">
                    <Timer onLog={() => refreshTableRef.current?.()} />
                    <TimeblockTable refreshRef={refreshTableRef}/>
                </div>
            </main>
        </div>
    );
}