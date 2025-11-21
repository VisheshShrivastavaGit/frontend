import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { get as apiGet } from "../api";
import { useData } from "../contexts/DataProvider";
import { useGoogleAuth } from "../contexts/GoogleAuthProvider";

export default function CourseForm() {
  const { createCourse, updateCourse } = useData();
  const { user } = useGoogleAuth();
  const { id } = useParams();
  const isEdit = !!id;
  const [loading, setLoading] = React.useState(false);
  const [form, setForm] = React.useState({
    IndivCourse: "",
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
    apiGet(`/attendance/${user.id}/${id}`)
      .then((res) => {
        if (!mounted) return;
        const c = res?.data;
        if (c) {
          setForm({
            IndivCourse: c.IndivCourse || "",
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
  }, [id, isEdit, user]);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const errs = {};

      if (!form.IndivCourse || String(form.IndivCourse).trim().length < 2) {
        errs.IndivCourse = "Course name is required (min 2 chars)";
      }
      if (!form.timeofcourse || String(form.timeofcourse).trim().length < 2) {
        errs.timeofcourse = "Time is required (min 2 chars)";
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

      if (isEdit) {
        await updateCourse(id, form);
        navigate("/courses");
      } else {
        try {
          await createCourse(form);
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

  // return (
  //   <div className="max-w-lg mx-auto">
  //     <h2 className="text-xl font-semibold mb-4">
  //       {isEdit ? "Edit Course" : "New Course"}
  //     </h2>
  //     {/* {error && <div className="text-red-600 mb-2">{error}</div>} */}
  //     <form onSubmit={submit} className="space-y-3">
  //       <div>
  //         <label className="block text-sm">Course name</label>
  //         <input
  //           name="IndivCourse"
  //           value={form.IndivCourse}
  //           onChange={change}
  //           required
  //           className="w-full border rounded p-2"
  //         />
  //       </div>
  //       <div>
  //         <label className="block text-sm">Time</label>
  //         <input
  //           name="timeofcourse"
  //           value={form.timeofcourse}
  //           onChange={change}
  //           className="w-full border rounded p-2"
  //         />
  //       </div>
  //       <div className="grid grid-cols-3 gap-2">
  //         <div>
  //           <label className="block text-sm">Total days</label>
  //           <input
  //             name="Totaldays"
  //             type="number"
  //             value={form.Totaldays}
  //             onChange={change}
  //             className="w-full border rounded p-2"
  //           />
  //         </div>
  //         <div>
  //           <label className="block text-sm">Present</label>
  //           <input
  //             name="present"
  //             type="number"
  //             value={form.present}
  //             onChange={change}
  //             className="w-full border rounded p-2"
  //           />
  //         </div>
  //         <div>
  //           <label className="block text-sm">Absent</label>
  //           <input
  //             name="absent"
  //             type="number"
  //             value={form.absent}
  //             onChange={change}
  //             className="w-full border rounded p-2"
  //           />
  //         </div>
  //       </div>
  //       <div className="grid grid-cols-2 gap-2">
  //         <div>
  //           <label className="block text-sm">Cancelled</label>
  //           <input
  //             name="cancelled"
  //             type="number"
  //             value={form.cancelled}
  //             onChange={change}
  //             className="w-full border rounded p-2"
  //           />
  //         </div>
  //         <div>
  //           <label className="block text-sm">Criteria (%)</label>
  //           <input
  //             name="criteria"
  //             type="number"
  //             value={form.criteria}
  //             onChange={change}
  //             className="w-full border rounded p-2"
  //           />
  //         </div>
  //       </div>
  //       <div>
  //         <label className="block text-sm mb-1">Days of the week</label>
  //         <div className="flex gap-2 mb-2">
  //           <button
  //             onClick={(e) => {
  //               e.preventDefault();
  //               setForm((s) => ({
  //                 ...s,
  //                 days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
  //               }));
  //             }}
  //             type="button"
  //             className="px-4 py-2 bg-blue-600 text-white rounded"
  //           >
  //             select all
  //           </button>
  //           <button
  //             onClick={(e) => {
  //               e.preventDefault();
  //               setForm((s) => ({
  //                 ...s,
  //                 days: [],
  //               }));
  //             }}
  //             type="button"
  //             className="px-4 py-2 bg-blue-600 text-white rounded"
  //           >
  //             clear all
  //           </button>
  //         </div>
  //         <div className="flex flex-wrap gap-2">
  //           {["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map((day) => (
  //             <button
  //               type="button"
  //               key={day}
  //               onClick={() => toggleDay(day)}
  //               className={`px-3 py-1 border rounded ${
  //                 form.days.includes(day)
  //                   ? "bg-blue-600 text-white"
  //                   : "bg-white text-black"
  //               }`}
  //             >
  //               {day.charAt(0).toUpperCase() + day.slice(1)}
  //             </button>
  //           ))}
  //         </div>
  //       </div>
  //       <div>
  //         <button
  //           disabled={loading}
  //           className="px-4 py-2 bg-blue-600 text-white rounded"
  //         >
  //           {loading ? "Saving…" : isEdit ? "Save changes" : "Create course"}
  //         </button>
  //       </div>
  //     </form>
  //   </div>
  // );

  return (
    <div className="max-w-xl mx-auto mt-8">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          {isEdit ? "Edit Course" : "Create New Course"}
        </h2>
        <form onSubmit={submit} className="space-y-5">
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
              placeholder="Enter course name"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">
                Start Time
              </label>
              <input
                name="startTime"
                type="time"
                value={form.startTime}
                onChange={change}
                className="w-full border rounded-lg p-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                End Time
              </label>
              <input
                name="endTime"
                type="time"
                value={form.endTime}
                onChange={change}
                className="w-full border rounded-lg p-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">
              Time Description
            </label>
            <input
              name="timeofcourse"
              value={form.timeofcourse}
              onChange={change}
              className="w-full border rounded-lg p-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="e.g. 9:00 AM - 10:00 AM"
            />
          </div>
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
                className="w-full border rounded-lg p-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
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
                className="w-full border rounded-lg p-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Absent</label>
              <input
                name="absent"
                type="number"
                value={form.absent}
                onChange={change}
                className="w-full border rounded-lg p-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>
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
                className="w-full border rounded-lg p-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
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
                className="w-full border rounded-lg p-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>
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
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow"
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
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg shadow"
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
          <div className="pt-4">
            <button
              disabled={loading}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition"
            >
              {loading ? "Saving…" : isEdit ? "Save Changes" : "Create Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
