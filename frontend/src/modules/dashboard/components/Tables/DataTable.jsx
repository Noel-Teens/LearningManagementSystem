import { useTheme } from '../../../../context/ThemeContext';

const DataTable = ({ columns, data, title }) => {
    const { isDark } = useTheme();

    return (
        <div
            className={`rounded-2xl overflow-hidden ${isDark
                ? 'bg-gray-800 border border-gray-700'
                : 'bg-white border border-gray-100 shadow-sm'
                }`}
        >
            {title && (
                <div className={`px-6 py-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                    <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {title}
                    </h3>
                </div>
            )}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className={isDark ? 'bg-gray-900/50' : 'bg-gray-50'}>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'
                                        }`}
                                >
                                    {column.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-100'}`}>
                        {data.map((row, rowIndex) => (
                            <tr
                                key={row.id || rowIndex}
                                className={`transition-colors ${isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
                                    }`}
                            >
                                {columns.map((column) => (
                                    <td
                                        key={column.key}
                                        className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'
                                            }`}
                                    >
                                        {column.render ? column.render(row[column.key], row) : row[column.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {data.length === 0 && (
                <div className={`px-6 py-8 text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    No data available
                </div>
            )}
        </div>
    );
};

export default DataTable;
