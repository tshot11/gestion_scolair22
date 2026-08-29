import React from "react";
export function Badge({
  children,
  variant = "slate",
  size = "md",
  dot = false,
  className = "",
  ...props
}) {
  const variantStyles = {
    slate:
      "bg-[#12305A]/45 backdrop-blur-md text-slate-700  border-[#94C5FF]/15",
    blue: "bg-blue-500/15 text-blue-300 border-[#94C5FF]/15",
    emerald: "bg-blue-600/15 text-emerald-300 border-emerald-500/30",
    amber: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    rose: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    purple: "bg-purple-500/15 text-purple-300 border-purple-500/30",
    indigo: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
    sky: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  };
  const dotColorStyles = {
    slate: "bg-slate-400",
    blue: "bg-blue-400",
    emerald: "bg-emerald-400",
    amber: "bg-amber-400",
    rose: "bg-rose-400",
    purple: "bg-purple-400",
    indigo: "bg-indigo-400",
    sky: "bg-sky-400",
  };
  const sizeStyles = {
    sm: "text-[10px] px-2 py-0.5 font-semibold tracking-wide",
    md: "text-xs px-2.5 py-1 font-semibold",
    lg: "text-xs sm:text-sm px-3 py-1.5 font-bold",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-[14px] border whitespace-nowrap select-none ${variantStyles[variant] || variantStyles.slate} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-[14px] shrink-0 ${dotColorStyles[variant] || dotColorStyles.slate}`}
        />
      )}
      {children}
    </span>
  );
}
export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = "blue",
  trend,
  trendPositive = true,
  onClick,
  className = "",
}) {
  const colorMap = {
    blue: "bg-blue-500/15 text-blue-400 border-[#94C5FF]/15 group-hover:bg-blue-500/25",
    emerald:
      "bg-blue-600/15 text-emerald-400 border-emerald-500/20 group-hover:bg-blue-600/25",
    amber:
      "bg-amber-500/15 text-amber-400 border-amber-500/20 group-hover:bg-amber-500/25",
    purple:
      "bg-purple-500/15 text-purple-400 border-purple-500/20 group-hover:bg-purple-500/25",
    rose: "bg-rose-500/15 text-rose-400 border-rose-500/20 group-hover:bg-rose-500/25",
    sky: "bg-sky-500/15 text-sky-400 border-sky-500/20 group-hover:bg-sky-500/25",
  };
  return (
    <div
      onClick={onClick}
      className={`p-3.5 sm:p-5 rounded-2xl bg-[#12305A]/45 backdrop-blur-md border border-[#94C5FF]/15 shadow-sm backdrop-blur-sm transition-all duration-200 group flex flex-col justify-between ${onClick ? "cursor-pointer hover:border-[#94C5FF]/15 hover:bg-[#12305A]/60 active:scale-[0.99]" : ""} ${className}`}
    ><div><div className="flex items-start justify-between gap-2 mb-2"><span className="text-[11px] sm:text-xs font-semibold text-blue-300/70 tracking-wide line-clamp-1">
            
            {title}
          </span>
          {Icon && (
            <div
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl border flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${colorMap[iconColor] || colorMap.blue}`}
            ><Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></div>
          )}
        </div><div className="text-sm xs:text-base sm:text-xl lg:text-2xl font-black text-white font-heading tracking-tight truncate">
          
          {value}
        </div></div>
      {(subtitle || trend) && (
        <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5 mt-2.5 pt-2 border-t border-[#94C5FF]/15 text-[10px] sm:text-[11px] text-blue-300/70">
          
          {trend && (
            <span
              className={`font-bold flex items-center gap-0.5 ${trendPositive ? "text-emerald-400" : "text-rose-400"}`}
            >
              
              {trend}
            </span>
          )}
          {subtitle && (
            <span className="text-blue-300/70 truncate max-w-full">
              
              {trend ? `• ${subtitle}` : subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
