'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface UIContextType {
    isBottomNavVisible: boolean;
    setBottomNavVisible: (visible: boolean) => void;
    isModalOpen: boolean;
    setModalOpen: (open: boolean) => void;
    activeModal: string | null;
    openModal: (modalId: string) => void;
    closeModal: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
    const [isBottomNavVisible, setBottomNavVisible] = useState(true);
    const [isModalOpen, setModalOpen] = useState(false);
    const [activeModal, setActiveModal] = useState<string | null>(null);

    const openModal = (modalId: string) => {
        setActiveModal(modalId);
        setModalOpen(true);
        setBottomNavVisible(false); // Hide bottom nav when modal opens
    };

    const closeModal = () => {
        setModalOpen(false);
        setActiveModal(null);
        setBottomNavVisible(true); // Show bottom nav when modal closes
    };

    return (
        <UIContext.Provider value={{
            isBottomNavVisible,
            setBottomNavVisible,
            isModalOpen,
            setModalOpen,
            activeModal,
            openModal,
            closeModal
        }}>
            {children}
        </UIContext.Provider>
    );
}

export const useUI = () => {
    const context = useContext(UIContext);
    if (context === undefined) {
        throw new Error('useUI must be used within a UIProvider');
    }
    return context;
};