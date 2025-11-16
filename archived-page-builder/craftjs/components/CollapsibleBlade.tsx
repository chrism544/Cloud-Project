"use client";
import { useState, ReactNode } from "react";
import { ChevronDown } from "lucide-react";

interface CollapsibleBladeProps {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

export const CollapsibleBlade = ({ title, defaultOpen = false, children }: CollapsibleBladeProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-700">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between bg-gray-800 hover:bg-gray-750 transition-colors text-left"
      >
        <span className="font-medium text-gray-200">{title}</span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="bg-gray-850 p-4 space-y-4">
          {children}
        </div>
      )}
    </div>
  );
};
