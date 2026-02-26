"use client";

import { createContext, useCallback, useContext, useState } from "react";

export interface GenerationEntry {
    id: string;
    image: string | null;
    unlocked: boolean;
}

interface GenerationContextValue {
    recentGenerations: GenerationEntry[];
    addGeneration: (entry: GenerationEntry) => void;
    updateGeneration: (id: string, patch: Partial<GenerationEntry>) => void;
}

const GenerationContext = createContext<GenerationContextValue>({
    recentGenerations: [],
    addGeneration: () => { },
    updateGeneration: () => { },
});

export function GenerationProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [recentGenerations, setRecentGenerations] = useState<
        GenerationEntry[]
    >([]);

    const addGeneration = useCallback((entry: GenerationEntry) => {
        setRecentGenerations((prev) => {
            // Avoid duplicates (e.g. hot-reload / double-call)
            if (prev.some((g) => g.id === entry.id)) return prev;
            return [entry, ...prev];
        });
    }, []);

    const updateGeneration = useCallback(
        (id: string, patch: Partial<GenerationEntry>) => {
            setRecentGenerations((prev) =>
                prev.map((g) => (g.id === id ? { ...g, ...patch } : g)),
            );
        },
        [],
    );

    return (
        <GenerationContext.Provider
            value={{ recentGenerations, addGeneration, updateGeneration }}
        >
            {children}
        </GenerationContext.Provider>
    );
}

export function useGenerations() {
    return useContext(GenerationContext);
}
