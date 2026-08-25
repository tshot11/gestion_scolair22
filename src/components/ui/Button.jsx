import React from "react";
export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  isLoading = false,
  icon: Icon,
  iconPosition = "left",
  onClick,
  type = "button",
  fullWidth = false,
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 select-none";
  const sizeStyles = {
    sm: "text-xs px-3 py-1.5 gap-1.5",
    md: "text-xs sm:text-sm px-4 py-2.5 gap-2",
    lg: "text-sm sm:text-base px-5 py-3 gap-2.5",
  };
  const variantStyles = {
    primary:
      "bg-emerald-500/90 hover:bg-emerald-400 backdrop-blur-md text-white shadow-sm hover:shadow-md focus:ring-emerald-400 border border-emerald-400/50",
    secondary:
      "bg-[#12305A]/45 hover:bg-[#12305A]/45 backdrop-blur-md text-blue-900 hover:text-blue-600 :text-white border border-[#94C5FF]/15 focus:ring-blue-400/50 shadow-sm",
    outline:
      "bg-transparent hover:bg-[#12305A]/45 bg-[#12305A]/45 backdrop-blur-md/60 backdrop-blur-md text-slate-700 B8C7DF] hover:text-white border border-[#94C5FF]/15 focus:ring-blue-400/50",
    ghost:
      "bg-transparent hover:bg-blue-500/10 text-[#F5F9FF]0 B8C7DF] hover:text-[#F5F9FF] border border-transparent focus:ring-slate-700",
    danger:
      "bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/25 focus:ring-rose-500 border border-rose-500/30",
    success:
      "bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/25 focus:ring-emerald-500 border border-emerald-500/30",
    amber:
      "bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-600/25 focus:ring-amber-500 border border-amber-500/30",
    white:
      "bg-white hover:bg-slate-100 text-[#F5F9FF] shadow-md shadow-black/10 focus:ring-white border border-[#94C5FF]/15 font-semibold",
  };
  const widthStyle = fullWidth ? "w-full" : "";
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
      {...props}
    >
      {" "}
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-[14px] animate-spin shrink-0"></span>
      ) : Icon && iconPosition === "left" ? (
        <Icon
          className={`${size === "sm" ? "w-3.5 h-3.5" : size === "lg" ? "w-5 h-5" : "w-4 h-4"} shrink-0`}
        />
      ) : null}{" "}
      <span>{children}</span>{" "}
      {!isLoading && Icon && iconPosition === "right" ? (
        <Icon
          className={`${size === "sm" ? "w-3.5 h-3.5" : size === "lg" ? "w-5 h-5" : "w-4 h-4"} shrink-0`}
        />
      ) : null}{" "}
    </button>
  );
}
