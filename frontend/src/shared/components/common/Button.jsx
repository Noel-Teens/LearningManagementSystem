const Button = ({
    children,
    type = 'button',
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    onClick,
    className = '',
    ...props
}) => {
    const baseStyles = 'font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center active:scale-95 shadow-sm hover:shadow-md';

    const variants = {
        primary: 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500 shadow-indigo-100',
        secondary: 'bg-slate-600 hover:bg-slate-700 text-white focus:ring-slate-500 shadow-slate-100',
        success: 'bg-emerald-500 hover:bg-emerald-600 text-white focus:ring-emerald-400 shadow-emerald-100',
        danger: 'bg-rose-500 hover:bg-rose-600 text-white focus:ring-rose-400 shadow-rose-100',
        outline: 'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500',
        ghost: 'text-slate-600 hover:bg-slate-100 focus:ring-slate-400',
    };

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-5 py-2.5 text-base',
        lg: 'px-8 py-4 text-lg font-semibold',
    };

    return (
        <button
            type={type}
            disabled={disabled || loading}
            onClick={onClick}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {loading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}
            {children}
        </button>
    );
};

export default Button;
