import { useTheme } from '../../../context/ThemeContext';

const StatCard = ({ title, value, icon: Icon, trend, trendLabel, color = 'indigo' }) => {
    const { isDark } = useTheme();

    const colorClasses = {
        indigo: {
            iconBg: isDark ? 'bg-indigo-900/50' : 'bg-indigo-100',
            iconText: isDark ? 'text-indigo-400' : 'text-indigo-600',
            trendUp: 'text-emerald-500',
            trendDown: 'text-rose-500',
        },
        emerald: {
            iconBg: isDark ? 'bg-emerald-900/50' : 'bg-emerald-100',
            iconText: isDark ? 'text-emerald-400' : 'text-emerald-600',
            trendUp: 'text-emerald-500',
            trendDown: 'text-rose-500',
        },
        amber: {
            iconBg: isDark ? 'bg-amber-900/50' : 'bg-amber-100',
            iconText: isDark ? 'text-amber-400' : 'text-amber-600',
            trendUp: 'text-emerald-500',
            trendDown: 'text-rose-500',
        },
        rose: {
            iconBg: isDark ? 'bg-rose-900/50' : 'bg-rose-100',
            iconText: isDark ? 'text-rose-400' : 'text-rose-600',
            trendUp: 'text-emerald-500',
            trendDown: 'text-rose-500',
        },
    };

    const colors = colorClasses[color] || colorClasses.indigo;

    return (
        <div
            className={`rounded-2xl p-6 transition-all duration-300 hover:shadow-lg ${isDark
                ? 'bg-gray-800 border border-gray-700 hover:border-gray-600'
                : 'bg-white border border-gray-100 shadow-sm hover:shadow-xl'
                }`}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {title}
                    </p>
                    <p className={`text-3xl font-bold mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {typeof value === 'number' ? value.toLocaleString() : value}
                    </p>
                    {trend !== undefined && (
                        <div className="flex items-center mt-2 gap-1">
                            <span className={trend >= 0 ? colors.trendUp : colors.trendDown}>
                                {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
                            </span>
                            {trendLabel && (
                                <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                    {trendLabel}
                                </span>
                            )}
                        </div>
                    )}
                </div>
                {Icon && (
                    <div className={`p-3 rounded-xl ${colors.iconBg}`}>
                        <Icon className={`w-6 h-6 ${colors.iconText}`} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatCard;
