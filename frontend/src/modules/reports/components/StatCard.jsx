import { useTheme } from '../../../context/ThemeContext';

const StatCard = ({ icon: Icon, label, value, subValue, color = 'indigo' }) => {
    const { isDark } = useTheme();

    const colorMap = {
        indigo: {
            bg: isDark ? 'bg-indigo-900/30' : 'bg-indigo-50',
            icon: 'text-indigo-500',
            border: isDark ? 'border-indigo-800/50' : 'border-indigo-100',
            glow: 'shadow-indigo-500/10',
        },
        emerald: {
            bg: isDark ? 'bg-emerald-900/30' : 'bg-emerald-50',
            icon: 'text-emerald-500',
            border: isDark ? 'border-emerald-800/50' : 'border-emerald-100',
            glow: 'shadow-emerald-500/10',
        },
        amber: {
            bg: isDark ? 'bg-amber-900/30' : 'bg-amber-50',
            icon: 'text-amber-500',
            border: isDark ? 'border-amber-800/50' : 'border-amber-100',
            glow: 'shadow-amber-500/10',
        },
        rose: {
            bg: isDark ? 'bg-rose-900/30' : 'bg-rose-50',
            icon: 'text-rose-500',
            border: isDark ? 'border-rose-800/50' : 'border-rose-100',
            glow: 'shadow-rose-500/10',
        },
        sky: {
            bg: isDark ? 'bg-sky-900/30' : 'bg-sky-50',
            icon: 'text-sky-500',
            border: isDark ? 'border-sky-800/50' : 'border-sky-100',
            glow: 'shadow-sky-500/10',
        },
    };

    const c = colorMap[color] || colorMap.indigo;

    return (
        <div className={`relative overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${c.glow} ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'}`}>
            <div className="flex items-start justify-between">
                <div>
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>{label}</p>
                    <p className={`text-3xl font-bold mt-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{value}</p>
                    {subValue && (
                        <p className={`text-xs font-medium mt-1 ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>{subValue}</p>
                    )}
                </div>
                {Icon && (
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${c.bg} ${c.border} border`}>
                        <Icon className={`w-6 h-6 ${c.icon}`} />
                    </div>
                )}
            </div>
            {/* Decorative gradient */}
            <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-10 ${c.bg}`} />
        </div>
    );
};

export default StatCard;
