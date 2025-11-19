"use client";

import { ReactNode, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ModernCardProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
  defaultExpanded?: boolean;
  collapsible?: boolean;
  className?: string;
}

export default function ModernCard({
  title,
  subtitle,
  icon,
  children,
  defaultExpanded = false,
  collapsible = false,
  className = "",
}: ModernCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300 ${className}`}>
      <div
        className={`p-6 ${collapsible ? "cursor-pointer" : ""}`}
        onClick={() => collapsible && setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            {icon && (
              <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl">
                {icon}
              </div>
            )}
            <div>
              <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
              {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
            </div>
          </div>
          {collapsible && (
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
          )}
        </div>
      </div>

      {(!collapsible || isExpanded) && (
        <div className="px-6 pb-6 pt-0">
          <div className="border-t border-white/10 pt-4">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
