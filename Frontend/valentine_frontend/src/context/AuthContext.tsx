import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
    id: string;
    name: string;
    email: string;
    role: "USER" | "ADMIN";
}

interface AuthContextType {
    user: User | null;
    login: (token: string, user: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for existing session/token
        // Ideally we hit /api/v1/auth/me here, but for now we look for persisted state if any
        // Since we use httpOnly cookies, we rely on the backend to tell us if we are logged in.
        // We can try to fetch user on mount.
        const checkAuth = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/v1/auth/me`, {
                    headers: {
                        // If using local storage token: Authorization: `Bearer ${token}`
                        // But we use cookies, so credentials: include is key
                    },
                });
                // We'll implement actual fetch logic in the pages or a hook using React Query later.
                // For simpler context, let's assume we read from localStorage for "user" info if we want to validte vaguely
                // OR better, we simply setIsLoaded(false) and let the protected routes handle the check.
                // For this MVP step, we'll initialize loading to false.
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = (token: string, userData: User) => {
        setUser(userData);
        setIsLoading(false);
    };

    const logout = () => {
        setUser(null);
        // Call backend logout
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
