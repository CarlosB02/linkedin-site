"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import LoginModal from "@/components/LoginModal";

interface UIContextType {
    isLoginModalOpen: boolean;
    openLoginModal: () => void;
    closeLoginModal: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    const openLoginModal = () => setIsLoginModalOpen(true);
    const closeLoginModal = () => setIsLoginModalOpen(false);

    return (
        <UIContext.Provider
            value={{ isLoginModalOpen, openLoginModal, closeLoginModal }}
        >
            {children}
            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={closeLoginModal}
            />
        </UIContext.Provider>
    );
}

export function useUI() {
    const context = useContext(UIContext);
    if (context === undefined) {
        throw new Error("useUI must be used within a UIProvider");
    }
    return context;
}
