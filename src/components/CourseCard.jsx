import React from "react";
import { Link } from "react-router-dom";

export default function CourseCard({ course = {} }) {
  const {
    id,
    IndivCourse = "Course Name",
    timeofcourse = "09:00",
    present = 0,
    absent = 0,
    Totaldays = 35,
    days = [],
  } = course;
  return (
    <div className="block">
      <div className="border rounded-lg p-4 shadow bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-blue-700 dark:text-blue-300">
              {IndivCourse}
            </h3>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {timeofcourse}
            </div>
            {days && days.length > 0 && (
              <div className="mt-2 flex gap-1 flex-wrap">
                {days.map((d) => (
                  <span
                    key={d}
                    className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-xs rounded text-blue-700 dark:text-blue-200"
                  >
                    {d}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Days</div>
            <div className="font-bold text-blue-700 dark:text-blue-300">
              {Totaldays}
            </div>
          </div>
        </div>
        <div className="mt-3 flex gap-4">
          <div className="text-sm">
            <div className="text-gray-500 dark:text-gray-400">Present</div>
            <div className="font-semibold text-green-600 dark:text-green-400">
              {present}
            </div>
          </div>
          <div className="text-sm">
            <div className="text-gray-500 dark:text-gray-400">Absent</div>
            <div className="font-semibold text-red-600 dark:text-red-400">
              {absent}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
