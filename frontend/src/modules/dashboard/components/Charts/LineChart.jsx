import {
    LineChart as RechartsLineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { useTheme } from '../../../../context/ThemeContext';

const LineChart = ({ data, xKey, yKey, title, color = '#6366f1' }) => {
    const { isDark } = useTheme();

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
                    <RechartsLineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke={isDark ? '#374151' : '#e5e7eb'}
                            vertical={false}
                        />
                        <XAxis
                            dataKey={xKey}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: isDark ? '#9ca3af' : '#6b7280', fontSize: 12 }}
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
                        <Line
                            type="monotone"
                            dataKey={yKey}
                            stroke={color}
                            strokeWidth={3}
                            dot={{ fill: color, strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                    </RechartsLineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default LineChart;
