import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/auth");
    }

    return (
        <nav className="border-b border-[#2a2d38] bg-[#16181f]">
            <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
                <span className="text-[#e2a84b] font-mono text-sm tracking-widest uppercase">Worklog</span>
                <button
                    onClick={handleLogout}
                    className="text-[#6b7280] hover:text-white cursor-pointer text-sm transition-colors duration-200"
                >
                    Sign out
                </button>
            </div>
        </nav>
    );
}