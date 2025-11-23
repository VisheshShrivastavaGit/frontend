import React from "react";
import CourseCard from "../components/CourseCard";
import { useData } from "../contexts/AppProvider";
import { Link } from "react-router-dom";

export default function Courses() {
  const { courses, searchedCourses, loading, error } = useData();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">
          Courses
        </h2>
        <div>
          <Link
            to="/courses/new"
            className="px-3 py-1 bg-blue-500 text-white rounded"
          >
            New Course
          </Link>
        </div>
      </div>

      {loading && (
        <div className="mt-6 text-gray-300">
          Loading courses…
        </div>
      )}
      {error && <div className="mt-6 text-red-600">{error}</div>}

      {!loading && !error && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.length === 0 && (
            <div className="text-gray-300">
              No courses found.
            </div>
          )}
          {searchedCourses !== " " &&
            courses
              .filter((c) =>
                c.IndivCourse.toLowerCase().includes(
                  searchedCourses.toLowerCase()
                )
              )
              .map((c) => <CourseCard key={c.id} course={c} />)}
        </div>
      )}
    </div>
  );
}
