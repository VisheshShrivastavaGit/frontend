/**
 * Demo Data Generator for Attendance Tracker
 * Generates realistic sample data for demo mode
 */

export const DEMO_USER = {
    id: 999999,
    email_address: "demo@attendance-tracker.app",
    name: "Demo User",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Demo",
    verified: true,
};
userId: DEMO_USER.id,
    days: ["mon", "fri"],
    },
  ];
}

export function getInitialDemoData() {
    return {
        user: DEMO_USER,
        courses: generateDemoCourses(),
    };
}

/**
 * Get demo data from localStorage or initialize with defaults
 */
export function loadDemoData() {
    const stored = localStorage.getItem("attendanceTrackerDemoData");
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error("Failed to parse demo data:", e);
            return getInitialDemoData();
        }
    }
    return getInitialDemoData();
}

/**
 * Save demo data to localStorage
 */
export function saveDemoData(data) {
    localStorage.setItem("attendanceTrackerDemoData", JSON.stringify(data));
}

/**
 * Clear demo data from localStorage
 */
export function clearDemoData() {
    localStorage.removeItem("attendanceTrackerDemoData");
    localStorage.removeItem("attendanceTrackerDemoMode");
}

/**
 * Check if demo mode is active
 */
export function isDemoMode() {
    return localStorage.getItem("attendanceTrackerDemoMode") === "true";
}

/**
 * Set demo mode status
 */
export function setDemoMode(active) {
    if (active) {
        localStorage.setItem("attendanceTrackerDemoMode", "true");
        // Initialize demo data if not exists
        const data = loadDemoData();
        saveDemoData(data);
    } else {
        clearDemoData();
    }
}
