import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials: true
});

export async function register({ username, email, password }) {
    try {
        const response = await api.post('/api/auth/register', {
            username, email, password
        });
        return response.data;
    } catch (err) {
        console.error("Registration error:", err.response?.data || err.message);
        throw err.response?.data || new Error("Registration failed");
    }
}

export async function login({ email, password }) {
    try {
        const response = await api.post("/api/auth/login", {
            email, password
        });
        return response.data;
    } catch (err) {
        console.error("Login error:", err.response?.data || err.message);
        throw err.response?.data || new Error("Login failed");
    }
}

export async function googleLogin(token) {
    try {
        const response = await api.post("/api/auth/google", {
            token
        });
        return response.data;
    } catch (err) {
        console.error("Google Login error:", err.response?.data || err.message);
        throw err.response?.data || new Error("Google Login failed");
    }
}

export async function logout() {
    try {
        const response = await api.post("/api/auth/logout");
        return response.data;
    } catch (err) {
        console.error("Logout error:", err.message);
        throw err;
    }
}

export async function getMe() {
    try {
        const response = await api.get("/api/auth/get-me");
        return response.data;
    } catch (err) {
        // Return null silently for unauthenticated / 401 initial session check
        return null;
    }
}

export async function updateProfileApi(profileData) {
    try {
        const response = await api.put("/api/auth/profile", profileData);
        return response.data;
    } catch (err) {
        console.error("Update profile error:", err.response?.data || err.message);
        throw err.response?.data || new Error("Failed to update profile");
    }
}

export async function uploadAvatarApi(file) {
    try {
        const formData = new FormData();
        formData.append("avatar", file);

        const response = await api.post("/api/auth/upload-avatar", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data;
    } catch (err) {
        console.error("Upload avatar error:", err.response?.data || err.message);
        throw err.response?.data || new Error("Failed to upload avatar");
    }
}
