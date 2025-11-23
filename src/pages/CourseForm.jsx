import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useData } from "../contexts/DataProvider";
import { useGoogleAuth } from "../contexts/GoogleAuthProvider";

// Helper function to convert 24h time to 12h AM/PM format
function formatTime(time24) {
  if (!time24) return "";
  const [hours, minutes] = time24.split(":");
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}

export default function CourseForm() {
  const { createCourse, updateCourse, getCourse } = useData();
  const { user } = useGoogleAuth();
  const { id } = useParams();
  const isEdit = !!id;
  const [loading, setLoading] = React.useState(false);
  const [form, setForm] = React.useState({
    IndivCourse: "",
    startTime: "",
    endTime: "",
    timeofcourse: "",
    Totaldays: 35,
    present: 0,
    absent: 0,
    cancelled: 0,
    criteria: 75,
    days: [],
  });
  const navigate = useNavigate();

  React.useEffect(() => {
    let mounted = true;
    if (!isEdit || !user) return;
    setLoading(true);

    // Use getCourse which handles both demo and real mode
    getCourse(Number(id))
      .then((c) => {
        if (!mounted) return;
        if (c) {
          setForm({
            IndivCourse: c.IndivCourse || "",
            startTime: c.startTime || "",
            endTime: c.endTime || "",
            timeofcourse: c.timeofcourse || "",
            Totaldays: c.Totaldays ?? 35,
            present: c.present ?? 0,
            absent: c.absent ?? 0,
            cancelled: c.cancelled ?? 0,
            criteria: c.criteria ?? 75,
            days: c.days || [],
          });
        }
      })
      .catch((err) => {
        console.error("Failed to load course:", err);
        alert("Failed to load course data: " + (err?.message || "Unknown error"));
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [id, isEdit, user, getCourse]);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const errs = {};

      if (!form.IndivCourse || String(form.IndivCourse).trim().length < 2) {
        errs.IndivCourse = "Course name is required (min 2 chars)";
      }
      if (!form.startTime || !form.endTime) {
        errs.time = "Both start and end times are required";
      }
      if (
        !Number.isInteger(Number(form.Totaldays)) ||
        Number(form.Totaldays) <= 0
      ) {
        errs.Totaldays = "Total days must be a positive integer";
      }
      if (!Number.isInteger(Number(form.present)) || Number(form.present) < 0) {
        errs.present = "Present must be >= 0";
      }
      if (!Number.isInteger(Number(form.absent)) || Number(form.absent) < 0) {
        errs.absent = "Absent must be >= 0";
      }
      if (Number(form.present) + Number(form.absent) > Number(form.Totaldays)) {
        errs.totalMismatch = "Present + Absent cannot exceed Total days";
      }
      if (Number(form.cancelled) < 0) {
        errs.cancelled = "Cancelled cannot be negative";
      }
      if (Number(form.criteria) < 0 || Number(form.criteria) > 100) {
        errs.criteria = "Criteria must be between 0 and 100";
      }
      if (!form.days || form.days.length === 0) {
        errs.days = "Select at least one day";
      }

      if (Object.keys(errs).length) {
        const firstKey = Object.keys(errs)[0];
        const firstMsg = errs[firstKey];
        alert(firstMsg);
        if (typeof setError === "function") setError(firstMsg);
        return;
      }

      const payload = {
        IndivCourse: form.IndivCourse,
        startTime: form.startTime,
        endTime: form.endTime,
        timeofcourse: form.timeofcourse,
        Totaldays: form.Totaldays,
        present: form.present,
        absent: form.absent,
        cancelled: form.cancelled,
        criteria: form.criteria,
        days: form.days,
      };

      if (isEdit) {
        await updateCourse(id, payload);
        navigate("/courses");
      } else {
        try {
          await createCourse(payload);
          navigate("/courses");
        } catch (error) {
          alert(
            "Failed to create course: " + (error?.message || "Unknown error")
          );
        }
      }
    } catch (err) {
      alert(err?.message || "Save failed");
    } finally {
      setLoading(false);
    }
  }

  function change(e) {
    const { name, value } = e.target;

    // Auto-generate timeofcourse when start or end time changes
    if (name === "startTime" || name === "endTime") {
      const newForm = { ...form, [name]: value };
      const startTime = name === "startTime" ? value : form.startTime;
      const endTime = name === "endTime" ? value : form.endTime;

      if (startTime && endTime) {
        newForm.timeofcourse = `${formatTime(startTime)} - ${formatTime(endTime)}`;
      }

      setForm(newForm);
      return;
    }

    if (isNaN(value) === false) {
      const num = parseInt(value, 10);
      setForm((s) => ({ ...s, [name]: isNaN(num) ? 0 : num }));
      return;
    }
    setForm((s) => ({ ...s, [name]: value }));
  }

  function toggleDay(day) {
    setForm((s) => {
      const has = (s.days || []).includes(day);
      return {
        ...s,
        days: has ? s.days.filter((d) => d !== day) : [...(s.days || []), day],
      };
    });
  }

  return (
    <div className="max-w-xl mx-auto mt-8">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          {isEdit ? "Edit Course" : "Create New Course"}
        </h2>
        <form onSubmit={submit} className="space-y-5">
          {/* Course Name */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Course Name
            </label>
            <input
              name="IndivCourse"
              value={form.IndivCourse}
              onChange={change}
              required
              className="w-full border rounded-lg p-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="e.g. Web Development, Data Structures"
            />
          </div>

          {/* Course Time */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Course Time
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Start Time
                </label>
                <input
                  name="startTime"
                  type="time"
                  value={form.startTime}
                  onChange={change}
                  required
                  className="w-full border rounded-lg p-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                  End Time
                </label>
                <input
                  name="endTime"
                  type="time"
                  value={form.endTime}
                  onChange={change}
                  required
                  className="w-full border rounded-lg p-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>
            </div>
            {form.timeofcourse && (
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">Display: </span>
                {form.timeofcourse}
              </div>
            )}
          </div>

          {/* Attendance Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">
                Total Days
              </label>
              <input
                name="Totaldays"
                type="number"
                value={form.Totaldays}
                onChange={change}
                className="w-full border rounded-lg p-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                Present
              </label>
              <input
                name="present"
                type="number"
                value={form.present}
                onChange={change}
                className="w-full border rounded-lg p-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Absent</label>
              <input
                name="absent"
                type="number"
                value={form.absent}
                onChange={change}
                className="w-full border rounded-lg p-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
          </div>

          {/* Cancelled and Criteria */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">
                Cancelled
              </label>
              <input
                name="cancelled"
                type="number"
                value={form.cancelled}
                onChange={change}
                className="w-full border rounded-lg p-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                Criteria (%)
              </label>
              <input
                name="criteria"
                type="number"
                value={form.criteria}
                onChange={change}
                className="w-full border rounded-lg p-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
          </div>

          {/* Days of the Week */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Days of the Week
            </label>
            <div className="flex gap-2 mb-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setForm((s) => ({
                    ...s,
                    days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
                  }));
                }}
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
              >
                Select All
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setForm((s) => ({
                    ...s,
                    days: [],
                  }));
                }}
                type="button"
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg shadow hover:bg-gray-400 transition"
              >
                Clear All
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map((day) => (
                <button
                  type="button"
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`px-3 py-1 border rounded-lg shadow transition-colors duration-150 ${form.days.includes(day)
                      ? "bg-blue-600 text-white"
                      : "bg-white text-black dark:bg-gray-800 dark:text-white"
                    }`}
                >
                  {day.charAt(0).toUpperCase() + day.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              disabled={loading}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving…" : isEdit ? "Save Changes" : "Create Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
