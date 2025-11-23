/**
 * Daily Attendance Tracking Utility
 * Prevents marking the same course multiple times on the same day
 */

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getTodayDate() {
    return new Date().toISOString().split('T')[0];
}

/**
 * Get localStorage key for today's attendance
 */
export function getStorageKey(userId) {
    return `dailyAttendance_${userId}_${getTodayDate()}`;
}

/**
 * Get courses marked today for a user
 * @returns {Object} { courseId: { status, timestamp }, ... }
 */
export function getMarkedCoursesToday(userId) {
    const key = getStorageKey(userId);
    const stored = localStorage.getItem(key);
    try {
        return stored ? JSON.parse(stored) : {};
    } catch (e) {
        console.error('Failed to parse daily attendance:', e);
        return {};
    }
}

/**
 * Check if a course has been marked today
 */
export function isCourseMarkedToday(userId, courseId) {
    const marked = getMarkedCoursesToday(userId);
    return !!marked[courseId];
}

/**
 * Get status of a course marked today
 * @returns {string|null} "present", "absent", "cancelled", or null
 */
export function getCourseStatusToday(userId, courseId) {
    const marked = getMarkedCoursesToday(userId);
    return marked[courseId]?.status || null;
}

/**
 * Mark a course for today
 */
export function markCourseToday(userId, courseId, status) {
    const key = getStorageKey(userId);
    const marked = getMarkedCoursesToday(userId);

    marked[courseId] = {
        status,
        timestamp: new Date().toISOString(),
    };

    localStorage.setItem(key, JSON.stringify(marked));
}

/**
 * Clear old attendance records (optional cleanup)
 * Call this on app initialization to keep localStorage clean
 */
export function cleanupOldAttendance(userId, daysToKeep = 30) {
    const today = new Date();
    const prefix = `dailyAttendance_${userId}_`;

    // Get all localStorage keys
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
            // Extract date from key
            const dateStr = key.replace(prefix, '');
            const date = new Date(dateStr);
            const daysDiff = (today - date) / (1000 * 60 * 60 * 24);

            if (daysDiff > daysToKeep) {
                keysToRemove.push(key);
            }
        }
    }

    // Remove old keys
    keysToRemove.forEach(key => localStorage.removeItem(key));

    if (keysToRemove.length > 0) {
        console.log(`Cleaned up ${keysToRemove.length} old attendance records`);
    }
}
