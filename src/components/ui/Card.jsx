import React from "react";
export function Card({
  children,
  className = "",
  onClick,
  hover = false,
  padding = "normal",
  ...props
}) {
  const paddingStyles = {
    none: "p-0",
    sm: "p-3 sm:p-4",
    normal: "p-4 sm:p-6",
    lg: "p-6 sm:p-8",
  };
  const hoverStyles = hover
    ? "hover:border-[#94C5FF]/15/80 hover:bg-[#12305A]/45 bg-[#12305A]/45 backdrop-blur-md/60 backdrop-blur-md hover:shadow-lg transition-all duration-200 cursor-pointer"
    : "";
  return (
    <div
      onClick={onClick}
      className={`bg-[#12305A]/45 bg-[#12305A]/45 backdrop-blur-md/60 backdrop-blur-md/80 border border-[#94C5FF]/15/90 rounded-2xl sm:rounded-2xl shadow-sm backdrop-blur-sm ${paddingStyles[padding]} ${hoverStyles} ${className}`}
      {...props}
    >
      {" "}
      {children}{" "}
    </div>
  );
}
export function CardHeader({
  title,
  subtitle,
  action,
  icon: Icon,
  className = "",
}) {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-[#94C5FF]/15/80 ${className}`}
    >
      {" "}
      <div className="flex items-center gap-3">
        {" "}
        {Icon && (
          <div className="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0">
            {" "}
            <Icon className="w-5 h-5" />{" "}
          </div>
        )}{" "}
        <div>
          {" "}
          {title && (
            <h3 className="text-base sm:text-lg font-bold font-heading text-white tracking-tight">
              {" "}
              {title}{" "}
            </h3>
          )}{" "}
          {subtitle && (
            <p className="text-xs text-[#F5F9FF]0 B8C7DF] mt-0.5">
              {" "}
              {subtitle}{" "}
            </p>
          )}{" "}
        </div>{" "}
      </div>{" "}
      {action && (
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {" "}
          {action}{" "}
        </div>
      )}{" "}
    </div>
  );
}
