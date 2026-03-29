import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";


function App() {
  const { isAuthenticated } = useAuth();

    return (
        <Routes>
            <Route
                path="/"
                element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/auth" />}
            />
            <Route
                path="/auth"
                element={isAuthenticated ? <Navigate to="/dashboard" /> : <AuthPage />}
            />
            <Route
                path="/dashboard"
                element={isAuthenticated ? <Dashboard /> : <Navigate to="/auth" />}
            />
        </Routes>
    );
}


export default App;