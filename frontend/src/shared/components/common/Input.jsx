import { forwardRef } from 'react';

const Input = forwardRef(({
    label,
    type = 'text',
    error,
    helperText,
    className = '',
    ...props
}, ref) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <input
                ref={ref}
                type={type}
                className={`
          w-full px-4 py-3 rounded-xl border transition-all duration-300
          focus:outline-none focus:ring-4 focus:ring-indigo-500/10
          ${error
                        ? 'border-rose-400 focus:border-rose-500 bg-rose-50/30'
                        : 'border-slate-200 focus:border-indigo-500 bg-white hover:border-slate-300'
                    }
          ${className}
        `}
                {...props}
            />
            {(error || helperText) && (
                <p className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
                    {error || helperText}
                </p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
