import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        setError("");
        setLoading(true);

        const endpoint = isLogin ? "/auth/login" : "/auth/register";

        try {
            const res = await api.post(endpoint, { email, password });
            login(res.data.token);
            navigate("/dashboard");
        } catch (err: any) {
            setError(err.response?.data?.error || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#0f1117] flex items-center justify-center px-4">

            {/* Background grid */}
            <div
                className="fixed inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(#e2a84b 1px, transparent 1px),
                                      linear-gradient(90deg, #e2a84b 1px, transparent 1px)`,
                    backgroundSize: "40px 40px"
                }}
            />

            {/* Card */}
            <div className="relative w-full max-w-md">

                {/* Amber glow behind card */}
                <div className="absolute -inset-0.5 bg-linear-to-br from-[#e2a84b] to-transparent opacity-20 rounded-2xl blur-xl" />

                <div className="relative bg-[#16181f] border border-[#2a2d38] rounded-2xl p-8 shadow-2xl">

                    {/* Logo / Title */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="text-[#e2a84b] font-mono text-sm tracking-widest uppercase">Worklog</span>
                        </div>

                        <h1 className="text-white text-3xl font-bold tracking-tight">
                            {isLogin ? "Welcome back" : "Get started"}
                        </h1>
                        <p className="text-[#6b7280] text-sm mt-1">
                            {isLogin ? "Sign in to your workspace" : "Create your account"}
                        </p>
                    </div>

                    {/* Toggle tabs */}
                    <div className="flex bg-[#0f1117] rounded-lg p-1 mb-6">
                        <button
                            onClick={() => { setIsLogin(true); setError(""); }}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                                isLogin
                                    ? "bg-[#e2a84b] text-[#0f1117]"
                                    : "text-[#6b7280] hover:text-white"
                            }`}
                        >
                            Sign in
                        </button>
                        <button
                            onClick={() => { setIsLogin(false); setError(""); }}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                                !isLogin
                                    ? "bg-[#e2a84b] text-[#0f1117]"
                                    : "text-[#6b7280] hover:text-white"
                            }`}
                        >
                            Register
                        </button>
                    </div>

                    {/* Form */}
                    <div className="space-y-4">
                        <div>
                            <label className="text-[#9ca3af] text-xs font-medium uppercase tracking-wider mb-1.5 block">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full bg-[#0f1117] border border-[#2a2d38] text-white rounded-lg px-4 py-3 text-sm placeholder-[#3d4150] focus:outline-none focus:border-[#e2a84b] transition-colors duration-200"
                            />
                        </div>

                        <div>
                            <label className="text-[#9ca3af] text-xs font-medium uppercase tracking-wider mb-1.5 block">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-[#0f1117] border border-[#2a2d38] text-white rounded-lg px-4 py-3 text-sm placeholder-[#3d4150] focus:outline-none focus:border-[#e2a84b] transition-colors duration-200"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                                <p className="text-red-400 text-sm">{error}</p>
                            </div>
                        )}

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full bg-[#e2a84b] hover:bg-[#d4963a] text-[#0f1117] font-semibold py-3 rounded-lg transition-all duration-200 text-sm mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Please wait..." : isLogin ? "Sign in" : "Create account"}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}