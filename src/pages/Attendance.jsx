import React, { useState, useEffect } from "react";
import { useData, useAuth } from "../contexts/AppProvider";
import {
  getMarkedCoursesToday,
  markCourseToday,
} from "../utils/attendanceTracking";

export default function Attendance() {
  const { courses, loading, error, updateCourse } = useData();
  const { user } = useAuth();
  const today = new Date()
    .toLocaleDateString("en-US", { weekday: "short" })
    .toLowerCase();
  const todayCourses = courses.filter(
    (c) =>
      Array.isArray(c.days) &&
      c.days.map((d) => d.toLowerCase()).includes(today)
  );

  const [markedCourses, setMarkedCourses] = useState({});
  const [updatingCourses, setUpdatingCourses] = useState({});

  useEffect(() => {
    if (user) {
      const marked = getMarkedCoursesToday(user.id);
      setMarkedCourses(marked);
    }
  }, [user]);

  async function markCourse(course, status) {
    if (markedCourses[course.id] || updatingCourses[course.id]) return;

    setUpdatingCourses((prev) => ({ ...prev, [course.id]: true }));

    const payload = { ...course };
    payload[status] = Number(course[status] || 0) + 1;

    try {
      await updateCourse(course.id, payload);
      markCourseToday(user.id, course.id, status);
      setMarkedCourses((prev) => ({
        ...prev,
        [course.id]: { status, timestamp: new Date().toISOString() },
      }));
    } catch (e) {
      alert("Failed to update attendance. Please try again.");
    } finally {
      setUpdatingCourses((prev) => {
        const next = { ...prev };
        delete next[course.id];
        return next;
      });
    }
  }

  return (
    <div className="p-4 sm:p-6 rounded-lg bg-gray-900 w-full shadow-md">
      <h3 className="mb-4 text-xl font-bold text-blue-300">
        Today's Courses
      </h3>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {todayCourses.length === 0 ? (
          <div className="text-gray-300">
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

            const isUpdating = updatingCourses[course.id];
            const isMarked = !!markedCourses[course.id];
            const markedStatus = markedCourses[course.id]?.status;
            const courseDisabled = isMarked || isUpdating;

            return (
              <div
                key={course.id || idx}
                className={`border rounded-lg p-4 bg-gray-800 flex flex-col gap-2 shadow ${aboveCriteria ? "border-green-500" : "border-red-500"
                  } ${isMarked ? "ring-2 ring-blue-400" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-base text-white truncate">
                    {course.IndivCourse}
                  </div>
                  <span
                    className={`text-sm font-semibold whitespace-nowrap ml-2 ${aboveCriteria ? "text-green-600" : "text-red-500"
                      }`}
                  >
                    {attendancePercentage.toFixed(2)}%
                  </span>
                </div>
                <div className="text-sm text-gray-400">
                  {course.timeofcourse}
                </div>
                <div className="text-xs text-gray-400">
                  Criteria: {course.criteria}%
                </div>

                {isMarked && (
                  <div className="text-xs font-semibold text-blue-400 flex items-center gap-1">
                    <span>✓</span>
                    <span>Marked as {markedStatus}</span>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mt-2 w-full">
                  <button
                    className={`flex-1 px-2 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition min-w-[80px] ${isUpdating ? "cursor-wait" : ""
                      }`}
                    onClick={() => markCourse(course, "present")}
                    disabled={courseDisabled}
                    title={
                      isMarked ? "Already marked for today" : "Mark as present"
                    }
                  >
                    {isUpdating ? "..." : "Present"}
                  </button>
                  <button
                    className={`flex-1 px-2 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition min-w-[80px] ${isUpdating ? "cursor-wait" : ""
                      }`}
                    onClick={() => markCourse(course, "absent")}
                    disabled={courseDisabled}
                    title={
                      isMarked ? "Already marked for today" : "Mark as absent"
                    }
                  >
                    {isUpdating ? "..." : "Absent"}
                  </button>
                  <button
                    className={`flex-1 px-2 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition min-w-[80px] ${isUpdating ? "cursor-wait" : ""
                      }`}
                    onClick={() => markCourse(course, "cancelled")}
                    disabled={courseDisabled}
                    title={
                      isMarked
                        ? "Already marked for today"
                        : "Mark as cancelled"
                    }
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
        <div className="mt-6 text-gray-300">Loading…</div>
      )}
      {error && <div className="mt-6 text-red-600">{error}</div>}
    </div>
  );
}