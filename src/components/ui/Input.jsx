import React from 'react';

export function Input({
  label,
  error,
  helperText,
  icon: Icon,
  rightIcon: RightIcon,
  onRightIconClick,
  className = '',
  id,
  type = 'text',
  required = false,
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label 
          htmlFor={inputId} 
          className="flex items-center justify-between text-xs font-semibold text-slate-300 tracking-wide"
        >
          <span>
            {label} {required && <span className="text-rose-400">*</span>}
          </span>
        </label>
      )}

      <div className="relative rounded-xl shadow-inner">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          id={inputId}
          type={type}
          required={required}
          className={`w-full py-2.5 text-xs sm:text-sm bg-slate-900/90 border rounded-xl text-slate-100 placeholder-slate-500 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 disabled:opacity-50 disabled:bg-slate-950 ${
            Icon ? 'pl-10' : 'pl-3.5'
          } ${RightIcon ? 'pr-10' : 'pr-3.5'} ${
            error 
              ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/30' 
              : 'border-slate-700/80 hover:border-slate-600'
          } ${className}`}
          {...props}
        />

        {RightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            tabIndex={-1}
            className={`absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition ${
              !onRightIconClick ? 'pointer-events-none' : 'cursor-pointer'
            }`}
          >
            <RightIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      {error ? (
        <p className="text-[11px] font-medium text-rose-400 flex items-center gap-1 mt-1">
          <span>•</span> {error}
        </p>
      ) : helperText ? (
        <p className="text-[11px] text-slate-400 mt-1">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}

export function Select({
  label,
  error,
  helperText,
  icon: Icon,
  children,
  className = '',
  id,
  required = false,
  ...props
}) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label 
          htmlFor={selectId} 
          className="flex items-center justify-between text-xs font-semibold text-slate-300 tracking-wide"
        >
          <span>
            {label} {required && <span className="text-rose-400">*</span>}
          </span>
        </label>
      )}

      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <select
          id={selectId}
          required={required}
          className={`w-full py-2.5 text-xs sm:text-sm bg-slate-900/90 border rounded-xl text-slate-100 placeholder-slate-500 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 disabled:opacity-50 disabled:bg-slate-950 appearance-none cursor-pointer pr-9 ${
            Icon ? 'pl-10' : 'pl-3.5'
          } ${
            error 
              ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/30' 
              : 'border-slate-700/80 hover:border-slate-600'
          } ${className}`}
          {...props}
        >
          {children}
        </select>

        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {error ? (
        <p className="text-[11px] font-medium text-rose-400 mt-1">
          {error}
        </p>
      ) : helperText ? (
        <p className="text-[11px] text-slate-400 mt-1">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
