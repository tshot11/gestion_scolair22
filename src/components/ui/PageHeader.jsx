import React from "react";
import { ChevronRight } from "lucide-react";
export function PageHeader({
  title,
  description,
  breadcrumbs = [],
  actions,
  badge,
  className = "",
}) {
  return (
    <div
      className={`flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-[#94C5FF]/15 ${className}`}
    ><div className="space-y-1.5 min-w-0">
        
        {breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 text-xs text-blue-300/70  mb-1">
            
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                
                {idx > 0 && (
                  <ChevronRight className="w-3.5 h-3.5 text-blue-300/50" />
                )}
                {crumb.onClick ? (
                  <button
                    onClick={crumb.onClick}
                    className="hover:text-blue-100 transition font-medium"
                  >
                    
                    {crumb.label}
                  </button>
                ) : (
                  <span
                    className={
                      idx === breadcrumbs.length - 1
                        ? "text-blue-100 font-semibold"
                        : ""
                    }
                  >
                    
                    {crumb.label}
                  </span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}
        <div className="flex flex-wrap items-center gap-2.5"><h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold font-heading text-white tracking-tight">
            
            {title}
          </h1>
          {badge}
        </div>
        {description && (
          <p className="text-xs sm:text-sm text-blue-300/70  max-w-3xl leading-relaxed">
            
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start md:self-auto">
          
          {actions}
        </div>
      )}
    </div>
  );
}
export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md",
  className = "",
}) {
  if (!isOpen) return null;
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-3xl",
    xl: "max-w-5xl",
    full: "max-w-full m-4",
  };
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 bg-[#0B1736]/80 backdrop-blur-md animate-in fade-in duration-200"><div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      /><div
        className={`relative w-full ${sizeClasses[size]} bg-[#12305A]/45 backdrop-blur-md border border-[#94C5FF]/15 rounded-2xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200 ${className}`}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-[#94C5FF]/15"><div>
            
            {title && (
              <h3 className="text-base sm:text-lg font-bold font-heading text-white">
                
                {title}
              </h3>
            )}
            {description && (
              <p className="text-xs text-blue-300/70  mt-0.5">
                
                {description}
              </p>
            )}
          </div><button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#12305A]/45 backdrop-blur-md hover:bg-[#12305A]/45 backdrop-blur-md text-blue-300/70  hover:text-white flex items-center justify-center transition"
          >
            
            ✕
          </button></div>
        {/* Content */}
        <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto">
          
          {children}
        </div></div></div>
  );
}
export function Tabs({ tabs = [], activeTab, onChange, className = "" }) {
  return (
    <div
      className={`flex items-center gap-1.5 p-1 bg-[#12305A]/45 backdrop-blur-md border border-[#94C5FF]/15 rounded-2xl overflow-x-auto no-scrollbar ${className}`}
    >
      
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 ${isActive ? "bg-blue-600 text-white shadow-md shadow-blue-600/20" : "text-blue-300/70  hover:text-blue-100 hover:bg-blue-500/10"}`}
          >
            
            {Icon && <Icon className="w-3.5 h-3.5" />} <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-[14px] font-bold ${isActive ? "bg-[#12305A]/45 text-white" : "bg-[#12305A]/45 backdrop-blur-md text-slate-700 "}`}
              >
                
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = "",
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl border border-dashed border-[#94C5FF]/15 bg-[#12305A]/45 backdrop-blur-md/30 ${className}`}
    >
      
      {Icon && (
        <div className="w-12 h-12 rounded-2xl bg-[#12305A]/45 backdrop-blur-md backdrop-blur-md border border-[#94C5FF]/15 text-blue-300/70  flex items-center justify-center mb-4"><Icon className="w-6 h-6" /></div>
      )}
      <h4 className="text-base font-bold text-blue-100 font-heading">
        
        {title}
      </h4>
      {description && (
        <p className="text-xs text-blue-300/70  max-w-sm mt-1 mb-5">
          
          {description}
        </p>
      )}
      {action}
    </div>
  );
}
