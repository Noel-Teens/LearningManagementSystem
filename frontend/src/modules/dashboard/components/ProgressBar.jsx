import { useTheme } from '../../../context/ThemeContext';

const ProgressBar = ({ label, progress, color = 'indigo', showPercentage = true }) => {
    const { isDark } = useTheme();

    const colorClasses = {
        indigo: 'bg-indigo-500',
        emerald: 'bg-emerald-500',
        amber: 'bg-amber-500',
        rose: 'bg-rose-500',
        blue: 'bg-blue-500',
    };

    const bgColor = colorClasses[color] || colorClasses.indigo;

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {label}
                </span>
                {showPercentage && (
                    <span className={`text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {progress}%
                    </span>
                )}
            </div>
            <div className={`w-full h-2.5 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div
                    className={`h-full rounded-full transition-all duration-500 ${bgColor}`}
                    style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                />
            </div>
        </div>
    );
};

export default ProgressBar;
