import React, { useState } from "react";
import { useData } from "../contexts/DataProvider";

export default function Attendance() {
  const { courses, loading, error, updateCourse } = useData();
  const today = new Date()
    .toLocaleDateString("en-US", { weekday: "short" })
    .toLowerCase();
  const todayCourses = courses.filter(
    (c) =>
      Array.isArray(c.days) &&
      c.days.map((d) => d.toLowerCase()).includes(today)
  );

  // Track which courses have been marked for today
  const [markedCourses, setMarkedCourses] = useState({});
  
  // Track which courses are currently being updated to prevent double-clicks
  const [updatingCourses, setUpdatingCourses] = useState({});

  async function markCourse(course, status) {
    // Prevent action if already marked OR currently being updated
    if (markedCourses[course.id] || updatingCourses[course.id]) return; 
    
    // Set loading state for this specific course
    setUpdatingCourses((prev) => ({ ...prev, [course.id]: true }));

    const payload = { ...course };
    payload[status] = Number(course[status] || 0) + 1;
    
    try {
      await updateCourse(course.id, payload);
      setMarkedCourses((prev) => ({
        ...prev,
        [course.id]: true,
      }));
      console.log(`Marked course ${course.id} as ${status}`);
    } catch (e) {
      alert("Failed to update attendance. Please try again.");
    } finally {
      // Clear the updating state regardless of success or failure
      setUpdatingCourses((prev) => {
        const next = { ...prev };
        delete next[course.id]; // Fixed logic error here
        return next;
      });
    }
  }

  return (
    <div className="p-4 sm:p-6 rounded-lg bg-white dark:bg-gray-900 w-full shadow-md">
      <h3 className="mb-4 text-xl font-bold text-blue-700 dark:text-blue-300">
        Today's Courses
      </h3>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {todayCourses.length === 0 ? (
          <div className="text-gray-600 dark:text-gray-300">
            No courses scheduled for today.
          </div>
        ) : (
          todayCourses.map((course, idx) => {
            const attendancePercentage =
              Math.round(
                (course.present * 100) / (course.present + course.absent)
              ) || 0;
            const aboveCriteria =
              attendancePercentage >= course.criteria ||
              (!course.present && !course.absent);
            
            // Check if this course is marked or currently updating
            const isUpdating = updatingCourses[course.id];
            const isMarked = markedCourses[course.id];
            const courseDisabled = isMarked || isUpdating;

            return (
              <div
                key={course.id || idx}
                className={`border rounded-lg p-4 bg-gray-50 dark:bg-gray-800 flex flex-col gap-2 shadow ${
                  aboveCriteria ? "border-green-500" : "border-red-500"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-base text-gray-900 dark:text-white truncate">
                    {course.IndivCourse}
                  </div>
                  <span
                    className={`text-sm font-semibold whitespace-nowrap ml-2 ${
                      aboveCriteria ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {attendancePercentage.toFixed(2)}%
                  </span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {course.timeofcourse}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Criteria: {course.criteria}%
                </div>
                
                {/* Fixed Button Layout */}
                <div className="flex flex-wrap gap-2 mt-2 w-full">
                  <button
                    className={`flex-1 px-2 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-semibold disabled:opacity-50 transition min-w-[80px] ${isUpdating ? 'cursor-wait' : ''}`}
                    onClick={() => markCourse(course, "present")}
                    disabled={courseDisabled}
                  >
                    {isUpdating ? "..." : "Present"}
                  </button>
                  <button
                    className={`flex-1 px-2 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-semibold disabled:opacity-50 transition min-w-[80px] ${isUpdating ? 'cursor-wait' : ''}`}
                    onClick={() => markCourse(course, "absent")}
                    disabled={courseDisabled}
                  >
                    {isUpdating ? "..." : "Absent"}
                  </button>
                  <button
                    className={`flex-1 px-2 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-sm font-semibold disabled:opacity-50 transition min-w-[80px] ${isUpdating ? 'cursor-wait' : ''}`}
                    onClick={() => markCourse(course, "cancelled")}
                    disabled={courseDisabled}
                  >
                    {isUpdating ? "..." : "Cancelled"}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
      {loading && (
        <div className="mt-6 text-gray-600 dark:text-gray-300">Loading…</div>
      )}
      {error && <div className="mt-6 text-red-600">{error}</div>}
    </div>
  );
}