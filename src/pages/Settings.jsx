import React from "react";
import { get, del } from "../api";
import { Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeProvider";
import { useData } from "../contexts/DataProvider";
import { useApiCall } from "../hooks/useApiCall";
import { SettingsCourseSkeleton } from "../components/Skeleton";

export default function Settings() {
  const { courses, loading, error, deleteCourse, deleteAll, resetAllStats, resetCourse } =
    useData();
  const { callApi } = useApiCall();
  const [deleting, setDeleting] = React.useState(null);
  const [deletingAll, setDeletingAll] = React.useState(false);
  const [resetting, setResetting] = React.useState(false);
  const [resettingCourse, setResettingCourse] = React.useState(null);

  async function handleResetAllStats() {
    if (!confirm("Reset ALL course stats (present/absent/cancelled) to zero?"))
      return;

    await callApi(
      () => resetAllStats(),
      {
        successMessage: "All course stats have been reset!",
        onSuccess: () => setResetting(false),
        onError: () => setResetting(false),
      }
    );
  }

  async function handleDelete(id) {
    if (!confirm("Delete this course?")) return;

    setDeleting(id);
    await callApi(
      () => deleteCourse(id),
      {
        silent: false,
        onSuccess: () => setDeleting(null),
        onError: () => setDeleting(null),
      }
    );
  }

  async function handleDeleteAll() {
    if (!confirm("Delete ALL courses? This cannot be undone.")) return;

    setDeletingAll(true);
    await callApi(
      () => deleteAll(),
      {
        successMessage: "All courses have been deleted!",
        onSuccess: () => setDeletingAll(false),
        onError: () => setDeletingAll(false),
      }
    );
  }

  async function handleResetCourse(id) {
    if (!confirm("Reset this course stats (present/absent/cancelled) to zero?"))
      return;

    setResettingCourse(id);
    await callApi(
      () => resetCourse(id),
      {
        successMessage: "Course stats have been reset!",
        onSuccess: () => setResettingCourse(null),
        onError: () => setResettingCourse(null),
      }
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 items-start sm:items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Settings
        </h2>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Link
            to="/courses/new"
            className="px-3 py-1 bg-blue-600 dark:bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Create course
          </Link>
          <button
            onClick={handleDeleteAll}
            disabled={deletingAll || courses.length === 0}
            className="px-3 py-1 bg-red-600 dark:bg-red-500 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deletingAll ? "Deleting…" : "Delete All"}
          </button>
          <button
            onClick={handleResetAllStats}
            disabled={resetting || courses.length === 0}
            className="px-3 py-1 bg-yellow-600 dark:bg-yellow-500 text-white rounded hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resetting ? "Resetting…" : "Reset All"}
          </button>
        </div>
      </div>

      <p className="mt-2 text-gray-700 dark:text-gray-300">
        Manage your courses (edit or delete) below.
      </p>

      {loading && (
        <div className="mt-4 space-y-3">
          <SettingsCourseSkeleton />
          <SettingsCourseSkeleton />
          <SettingsCourseSkeleton />
        </div>
      )}
      {error && <div className="mt-4 text-red-600">{error}</div>}

      {!loading && !error && (
        <div className="mt-4 space-y-3">
          {courses.length === 0 && (
            <div className="text-gray-600 dark:text-gray-300">
              No courses found.
            </div>
          )}
          {courses.map((c) => (
            <div
              key={c.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border p-3 rounded border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            >
              <div className="flex-1">
                <div className="font-semibold text-gray-900 dark:text-white">
                  {c.IndivCourse}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {c.timeofcourse}
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Link
                  to={`/courses/${c.id}/edit`}
                  className="flex-1 sm:flex-none px-3 py-1 text-center border rounded border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleResetCourse(c.id)}
                  disabled={resettingCourse === c.id}
                  className="flex-1 sm:flex-none px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors disabled:opacity-50"
                >
                  {resettingCourse === c.id ? "Resetting…" : "Reset"}
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  disabled={deleting === c.id}
                  className="flex-1 sm:flex-none px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {deleting === c.id ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
