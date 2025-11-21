/**
 * Skeleton loader component for course cards
 */
export function CourseSkeleton() {
    return (
        <div className="border p-4 rounded border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 animate-pulse">
            <div className="flex items-center justify-between mb-3">
                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
            </div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
    );
}

/**
 * Skeleton loader for settings page course list
 */
export function SettingsCourseSkeleton() {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border p-3 rounded border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 animate-pulse">
            <div className="flex-1 w-full">
                <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="flex-1 sm:flex-none h-8 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
                <div className="flex-1 sm:flex-none h-8 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
                <div className="flex-1 sm:flex-none h-8 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
            </div>
        </div>
    );
}

/**
 * Generic skeleton loader
 */
export function Skeleton({ className = "", count = 1 }) {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className={`bg-gray-300 dark:bg-gray-600 rounded animate-pulse ${className}`}
                ></div>
            ))}
        </>
    );
}
