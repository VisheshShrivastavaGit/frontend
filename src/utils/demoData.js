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

export function generateDemoCourses() {
  return [
    {
      id: 1,
      IndivCourse: "Web Development",
      timeofcourse: "10:00 AM - 11:30 AM",
      Totaldays: 35,
      present: 28,
      absent: 5,
      cancelled: 2,
      criteria: 75,
      userId: DEMO_USER.id,
      days: ["mon", "wed", "fri"],
    },
    {
      id: 2,
      IndivCourse: "Data Structures",
      timeofcourse: "2:00 PM - 3:30 PM",
      Totaldays: 35,
      present: 30,
      absent: 3,
      cancelled: 2,
      criteria: 75,
      userId: DEMO_USER.id,
      days: ["tue", "thu"],
    },
    {
      id: 3,
      IndivCourse: "Machine Learning",
      timeofcourse: "9:00 AM - 10:30 AM",
      Totaldays: 35,
      present: 22,
      absent: 10,
      cancelled: 3,
      criteria: 75,
      userId: DEMO_USER.id,
      days: ["mon", "wed"],
    },
    {
      id: 4,
      IndivCourse: "Database Systems",
      timeofcourse: "11:00 AM - 12:30 PM",
      Totaldays: 35,
      present: 32,
      absent: 2,
      cancelled: 1,
      criteria: 75,
      userId: DEMO_USER.id,
      days: ["tue", "thu", "fri"],
    },
    {
      id: 5,
      IndivCourse: "Software Engineering",
      timeofcourse: "3:00 PM - 4:30 PM",
      Totaldays: 35,
      present: 25,
      absent: 8,
      cancelled: 2,
      criteria: 75,
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
