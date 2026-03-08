"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    credits: number;
    setCredits: (credits: number) => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
    credits: 0,
    setCredits: () => { },
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [credits, setCredits] = useState(0);
    const supabase = createClient();

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setIsLoading(false);
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setIsLoading(false);
        });

        return () => subscription.unsubscribe();
    }, [supabase.auth]);

    return (
        <AuthContext.Provider value={{ user, isLoading, credits, setCredits }}>
            {children}
        </AuthContext.Provider>
    );
}
