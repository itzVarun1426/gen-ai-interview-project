import { useContext, useState } from "react";
import { authContext } from "../Auth.context.jsx";
import { login, register, logout, googleLogin } from "../services/auth.api.js";

export const useAuth = () => {
    const context = useContext(authContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    const { user, setUser, loading, setLoading } = context;
    const [authError, setAuthError] = useState(null);

    const handleLogin = async ({ email, password }) => {
        setAuthError(null);
        try {
            setLoading(true);
            const data = await login({ email, password });
            setUser(data.user);
            return true;
        } catch (err) {
            setAuthError(err.message || "Invalid credentials");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async ({ username, email, password }) => {
        setAuthError(null);
        try {
            setLoading(true);
            const data = await register({ username, email, password });
            setUser(data.user);
            return true;
        } catch (err) {
            setAuthError(err.message || "Registration failed");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setAuthError(null);
        try {
            setLoading(true);
            await logout();
            setUser(null);
            return true;
        } catch (err) {
            setAuthError("Logout failed");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async (token) => {
        setAuthError(null);
        try {
            setLoading(true);
            const data = await googleLogin(token);
            setUser(data.user);
            return true;
        } catch (err) {
            setAuthError(err.message || "Google Login failed");
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        user,
        loading,
        authError,
        handleLogin,
        handleRegister,
        handleLogout,
        handleGoogleLogin
    };
};