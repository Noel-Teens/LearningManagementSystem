import {
    BarChart as RechartsBarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';
import { useTheme } from '../../../../context/ThemeContext';

const BarChart = ({ data, xKey, bars, title }) => {
    const { isDark } = useTheme();

    const defaultColors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

    return (
        <div
            className={`rounded-2xl p-6 ${isDark
                ? 'bg-gray-800 border border-gray-700'
                : 'bg-white border border-gray-100 shadow-sm'
                }`}
        >
            {title && (
                <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {title}
                </h3>
            )}
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke={isDark ? '#374151' : '#e5e7eb'}
                            vertical={false}
                        />
                        <XAxis
                            dataKey={xKey}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: isDark ? '#9ca3af' : '#6b7280', fontSize: 11 }}
                            interval={0}
                            angle={-15}
                            textAnchor="end"
                            height={50}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: isDark ? '#9ca3af' : '#6b7280', fontSize: 12 }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: isDark ? '#1f2937' : '#ffffff',
                                border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                                borderRadius: '12px',
                                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                            }}
                            labelStyle={{ color: isDark ? '#f3f4f6' : '#111827', fontWeight: 600 }}
                            itemStyle={{ color: isDark ? '#d1d5db' : '#4b5563' }}
                        />
                        <Legend
                            wrapperStyle={{ paddingTop: '10px' }}
                            iconType="circle"
                            formatter={(value) => (
                                <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>{value}</span>
                            )}
                        />
                        {bars.map((bar, index) => (
                            <Bar
                                key={bar.dataKey}
                                dataKey={bar.dataKey}
                                name={bar.name || bar.dataKey}
                                fill={bar.color || defaultColors[index % defaultColors.length]}
                                radius={[4, 4, 0, 0]}
                            />
                        ))}
                    </RechartsBarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default BarChart;
