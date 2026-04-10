import { createContext, useState, useEffect } from "react";
import { getMe } from "./services/auth.api.js";

export const authContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await getMe();
                setUser(data?.user || null);
            } catch (err) {
                console.log("error fetching user", err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);


    return (
        <authContext.Provider value={{ user, setUser, loading, setLoading }}>
            {children}
        </authContext.Provider>
    )
}

