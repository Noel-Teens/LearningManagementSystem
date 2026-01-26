import { forwardRef } from 'react';
import { useTheme } from '../../../context/ThemeContext';

const Input = forwardRef(({
    label,
    type = 'text',
    error,
    helperText,
    className = '',
    ...props
}, ref) => {
    const { isDark } = useTheme();

    return (
        <div className="w-full">
            {label && (
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
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
                        : isDark
                            ? 'border-gray-600 focus:border-indigo-500 bg-gray-700 text-white placeholder-gray-400 hover:border-gray-500'
                            : 'border-slate-200 focus:border-indigo-500 bg-white hover:border-slate-300'
                    }
                    ${className}
                `}
                {...props}
            />
            {(error || helperText) && (
                <p className={`mt-1 text-sm ${error ? 'text-red-500' : isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {error || helperText}
                </p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
