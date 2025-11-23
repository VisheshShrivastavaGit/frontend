import React, { createContext, useContext, useState, useEffect } from "react";
import {
    isDemoMode as checkDemoMode,
    setDemoMode as updateDemoMode,
    loadDemoData,
    saveDemoData,
    clearDemoData,
    DEMO_USER,
} from "../utils/demoData";

const DemoContext = createContext(null);

export function useDemo() {
    return useContext(DemoContext);
}

export default function DemoProvider({ children }) {
    const [demoActive, setDemoActive] = useState(false);
    const [demoData, setDemoData] = useState(null);

    // Check demo mode on mount
    useEffect(() => {
        const isDemo = checkDemoMode();
        setDemoActive(isDemo);
        if (isDemo) {
            const data = loadDemoData();
            setDemoData(data);
        }
    }, []);

    /**
     * Enter demo mode
     */
    function enterDemo() {
        updateDemoMode(true);
        const data = loadDemoData();
        setDemoData(data);
        setDemoActive(true);
        console.log("✅ Entered demo mode");
    }

    /**
     * Exit demo mode
     */
    function exitDemo() {
        clearDemoData();
        setDemoData(null);
        setDemoActive(false);
        console.log("✅ Exited demo mode");
        // Reload to reset state
        window.location.reload();
    }

    /**
     * Get demo user
     */
    function getDemoUser() {
        return demoData?.user || DEMO_USER;
    }

    /**
     * Get demo courses
     */
    function getDemoCourses() {
        return demoData?.courses || [];
    }

    /**
     * Update demo courses
     */
    function updateDemoCourses(courses) {
        const newData = {
            ...demoData,
            courses,
        };
        setDemoData(newData);
        saveDemoData(newData);
    }

    /**
     * Add a course in demo mode
     */
    function addDemoCourse(course) {
        const courses = getDemoCourses();
        const newId = Math.max(0, ...courses.map((c) => c.id)) + 1;
        const newCourse = { ...course, id: newId, userId: DEMO_USER.id };
        updateDemoCourses([...courses, newCourse]);
        return newCourse;
    }

    /**
     * Update a course in demo mode
     */
    function updateDemoCourse(id, updates) {
        const courses = getDemoCourses();
        const updated = courses.map((c) =>
            c.id === id ? { ...c, ...updates } : c
        );
        updateDemoCourses(updated);
        return updated.find((c) => c.id === id);
    }

    /**
     * Delete a course in demo mode
     */
    function deleteDemoCourse(id) {
        const courses = getDemoCourses();
        const filtered = courses.filter((c) => c.id !== id);
        updateDemoCourses(filtered);
    }

    /**
     * Delete all courses in demo mode
     */
    function deleteAllDemoCourses() {
        updateDemoCourses([]);
    }

    /**
     * Reset all course stats in demo mode
     */
    function resetAllDemoStats() {
        const courses = getDemoCourses();
        const reset = courses.map((c) => ({
            ...c,
            present: 0,
            absent: 0,
            cancelled: 0,
        }));
        updateDemoCourses(reset);
    }

    /**
     * Reset single course stats in demo mode
     */
    function resetDemoCourseStats(id) {
        const courses = getDemoCourses();
        const reset = courses.map((c) =>
            c.id === id ? { ...c, present: 0, absent: 0, cancelled: 0 } : c
        );
        updateDemoCourses(reset);
        return reset.find((c) => c.id === id);
    }

    const value = {
        isDemoMode: demoActive,
        enterDemo,
        exitDemo,
        getDemoUser,
        getDemoCourses,
        addDemoCourse,
        updateDemoCourse,
        deleteDemoCourse,
        deleteAllDemoCourses,
        resetAllDemoStats,
        resetDemoCourseStats,
    };

    return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}
