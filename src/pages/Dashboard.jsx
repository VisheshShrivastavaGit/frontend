import React from "react";
import { useData } from "../contexts/DataProvider";
import { Link } from "react-router-dom";
import { CourseSkeleton } from "../components/Skeleton";

function attendancePercent(course) {
  const total = Number(course.present) + Number(course.absent);
  if (!total) return 0;
  return ((Number(course.present) / total) * 100).toFixed(2);
}

export default function Dashboard() {
  const { courses, loading, error } = useData();

  if (loading) {
    return (
      <div className="flex flex-col gap-6 px-4 md:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <CourseSkeleton />
          <CourseSkeleton />
          <CourseSkeleton />
        </div>
      </div>
    );
  }

  const totalCourses = courses.length;
  const coursesAboveCriteria = courses.filter(
    (course) =>
      Number(attendancePercent(course)) >= Number(course.criteria) ||
      (!course.present && !course.absent)
  );
  const coursesBelowCriteria = courses.filter(
    (course) =>
      Number(attendancePercent(course)) < Number(course.criteria) &&
      (course.present || course.absent)
  );

  if (totalCourses === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="mb-4 text-sm md:text-lg font-medium text-gray-500 dark:text-gray-300">
          No courses available. Start tracking your attendance by adding new
          courses.
        </p>
        <Link to="/courses/new">
          <button className="flex items-center justify-center gap-1 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded">
            <span className="mr-2">＋</span>
            Add Your First Course
          </button>
        </Link>
      </div>
    );
  }

  const overallPercent =
    (
      (courses.reduce((acc, course) => acc + Number(course.present || 0), 0) /
        courses.reduce(
          (acc, course) => acc + Number(course.Totaldays || 0),
          0
        )) *
      100
    ).toFixed(2) || 0;

  return (
    <div className="flex flex-col gap-6 px-4 md:px-6 lg:px-8">
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-6 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <h3 className="mb-4 text-lg font-semibold">Overall Attendance</h3>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
            <div
              className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full"
              style={{ width: `${overallPercent}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            {overallPercent}% of classes attended
          </p>
        </div>

        <div className="p-6 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm md:text-md">
          <h3 className="mb-4 text-lg font-semibold">Attendance Summary</h3>
          <div className="border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20 p-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-green-500 text-xl">✔</span>
              <span className="font-semibold">Courses Above Criteria</span>
            </div>
            <div className="mt-1 text-gray-700 dark:text-gray-300">
              {coursesAboveCriteria.length} out of {totalCourses} courses are on
              track.
            </div>
          </div>
          <div className="border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20 p-3">
            <div className="flex items-center gap-2">
              <span className="text-red-500 text-xl">⚠</span>
              <span className="font-semibold">Courses Below Criteria</span>
            </div>
            <div className="mt-1 text-gray-700 dark:text-gray-300">
              {coursesBelowCriteria.length} out of {totalCourses} courses need
              attention.
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 w-full md:w-[450px] mt-6">
        <h3 className="mb-4 text-lg font-semibold">Detailed Report</h3>
        <ul className="space-y-2">
          {courses.map((course, index) => {
            const attendancePercentage =
              Math.round(
                (course.present * 100) / (course.present + course.absent)
              ) || 0;
            return (
              <li key={index}>
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    {course.IndivCourse || "Unnamed Course"}
                  </span>
                  <span
                    className={`text-sm ${attendancePercentage >= course.criteria ||
                        (!course.present && !course.absent)
                        ? "text-green-500"
                        : "text-red-500"
                      }`}
                  >
                    {attendancePercentage.toFixed(2)}% attendance
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {error && <div className="mt-6 text-red-600">{error}</div>}
    </div>
  );
}
