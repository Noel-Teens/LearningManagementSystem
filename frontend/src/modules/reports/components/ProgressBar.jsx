import { useTheme } from '../../../context/ThemeContext';

const ProgressBar = ({ value = 0, size = 'md', color = 'indigo', showLabel = true, animated = true }) => {
    const { isDark } = useTheme();

    const colorMap = {
        indigo: isDark ? 'bg-indigo-500' : 'bg-indigo-600',
        emerald: isDark ? 'bg-emerald-500' : 'bg-emerald-600',
        amber: isDark ? 'bg-amber-500' : 'bg-amber-600',
        rose: isDark ? 'bg-rose-500' : 'bg-rose-600',
        sky: isDark ? 'bg-sky-500' : 'bg-sky-600',
    };

    const sizeMap = {
        sm: 'h-1.5',
        md: 'h-2.5',
        lg: 'h-4',
    };

    const barColor = colorMap[color] || colorMap.indigo;
    const barSize = sizeMap[size] || sizeMap.md;
    const clampedValue = Math.min(100, Math.max(0, value));

    return (
        <div className="flex items-center gap-3 w-full">
            <div className={`flex-1 rounded-full overflow-hidden ${barSize} ${isDark ? 'bg-gray-700' : 'bg-slate-200'}`}>
                <div
                    className={`${barSize} rounded-full ${barColor} ${animated ? 'transition-all duration-700 ease-out' : ''}`}
                    style={{ width: `${clampedValue}%` }}
                />
            </div>
            {showLabel && (
                <span className={`text-sm font-semibold min-w-[3rem] text-right ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                    {Math.round(clampedValue)}%
                </span>
            )}
        </div>
    );
};

export default ProgressBar;
