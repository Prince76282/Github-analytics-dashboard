'use client';

import React from 'react';
import { X } from 'lucide-react';
import { Sidebar } from './Sidebar';

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 md:hidden bg-black/40 backdrop-blur-xs flex"
    >
      <div className="relative w-64 h-full bg-app-surface shadow-2xl flex flex-col animate-in slide-in-from-left duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-3 p-1.5 text-typography-muted hover:text-typography-primary rounded"
          aria-label="Close navigation menu"
        >
          <X className="w-5 h-5" />
        </button>
        <Sidebar onItemClick={onClose} />
      </div>
      <div className="flex-1" onClick={onClose} />
    </div>
  );
};
