import React from 'react';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  isLoading = false,
  icon: Icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  fullWidth = false,
  ...props
}) {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] select-none";

  const sizeStyles = {
    sm: "text-xs px-3 py-1.5 gap-1.5",
    md: "text-xs sm:text-sm px-4 py-2.5 gap-2",
    lg: "text-sm sm:text-base px-5 py-3 gap-2.5"
  };

  const variantStyles = {
    primary: "bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/25 focus:ring-blue-500 border border-blue-500/30",
    secondary: "bg-slate-800 hover:bg-slate-700/90 text-slate-200 hover:text-white border border-slate-700/70 focus:ring-slate-600 shadow-sm",
    outline: "bg-transparent hover:bg-slate-800/60 text-slate-300 hover:text-white border border-slate-700 focus:ring-slate-600",
    ghost: "bg-transparent hover:bg-slate-800/50 text-slate-400 hover:text-slate-200 border border-transparent focus:ring-slate-700",
    danger: "bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/25 focus:ring-rose-500 border border-rose-500/30",
    success: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/25 focus:ring-emerald-500 border border-emerald-500/30",
    amber: "bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-600/25 focus:ring-amber-500 border border-amber-500/30",
    white: "bg-white hover:bg-slate-100 text-slate-900 shadow-md shadow-black/10 focus:ring-white border border-slate-200 font-semibold"
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
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0"></span>
      ) : Icon && iconPosition === 'left' ? (
        <Icon className={`${size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} shrink-0`} />
      ) : null}
      
      <span>{children}</span>

      {!isLoading && Icon && iconPosition === 'right' ? (
        <Icon className={`${size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} shrink-0`} />
      ) : null}
    </button>
  );
}
