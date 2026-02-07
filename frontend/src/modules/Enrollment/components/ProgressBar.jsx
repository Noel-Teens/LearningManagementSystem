import { useMemo } from 'react';

/**
 * Animated progress bar component
 * @param {number} progress - Progress percentage (0-100)
 * @param {string} size - Size variant: 'sm', 'md', 'lg'
 * @param {boolean} showLabel - Whether to show percentage label
 * @param {string} className - Additional CSS classes
 */
export default function ProgressBar({
    progress = 0,
    size = 'md',
    showLabel = true,
    className = ''
}) {
    const clampedProgress = Math.min(100, Math.max(0, progress));

    const sizeClasses = useMemo(() => ({
        sm: 'h-1.5',
        md: 'h-2.5',
        lg: 'h-4'
    }), []);

    const progressColor = useMemo(() => {
        if (clampedProgress === 100) return 'bg-green-500';
        if (clampedProgress >= 75) return 'bg-emerald-500';
        if (clampedProgress >= 50) return 'bg-blue-500';
        if (clampedProgress >= 25) return 'bg-indigo-500';
        return 'bg-violet-500';
    }, [clampedProgress]);

    return (
        <div className={`w-full ${className}`}>
            {showLabel && (
                <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        Progress
                    </span>
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        {clampedProgress}%
                    </span>
                </div>
            )}
            <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${sizeClasses[size]}`}>
                <div
                    className={`${progressColor} ${sizeClasses[size]} rounded-full transition-all duration-500 ease-out`}
                    style={{ width: `${clampedProgress}%` }}
                />
            </div>
        </div>
    );
}
