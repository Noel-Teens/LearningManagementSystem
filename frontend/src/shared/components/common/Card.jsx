import { useTheme } from '../../../context/ThemeContext';

const Card = ({
    children,
    title,
    subtitle,
    className = '',
    padding = true,
    ...props
}) => {
    const { isDark } = useTheme();

    return (
        <div
            className={`rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 ${isDark
                    ? 'bg-gray-800 border border-gray-700'
                    : 'bg-white border border-slate-100'
                } ${className}`}
            {...props}
        >
            {(title || subtitle) && (
                <div className={`px-6 py-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    {title && <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</h3>}
                    {subtitle && <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{subtitle}</p>}
                </div>
            )}
            <div className={padding ? 'p-6' : ''}>
                {children}
            </div>
        </div>
    );
};

export default Card;
